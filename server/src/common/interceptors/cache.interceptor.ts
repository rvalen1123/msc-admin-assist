import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
} from '@nestjs/common';
import { Observable, of } from 'rxjs';
import { tap } from 'rxjs/operators';
import { Redis } from 'ioredis';

@Injectable()
export class CacheInterceptor implements NestInterceptor {
  private readonly redis: Redis | null;
  private readonly defaultTTL: number = 3600; // 1 hour default TTL
  private readonly memoryCache: Map<string, { data: any, expiry: number }> = new Map();

  constructor() {
    // Check if we should use memory cache instead of Redis
    if (process.env.CACHE_DRIVER === 'memory' || process.env.REDIS_URL === 'memory') {
      console.log('Using in-memory cache instead of Redis');
      this.redis = null;
    } 
    // Only initialize Redis if not in test mode and URL is provided
    else if (process.env.NODE_ENV !== 'test' && process.env.REDIS_URL && process.env.REDIS_URL !== 'memory') {
      try {
        this.redis = new Redis(process.env.REDIS_URL || 'redis://localhost:6379');
        this.redis.on('error', (err) => {
          console.warn('Redis connection error, falling back to memory cache:', err.message);
          this.redis.disconnect();
        });
      } catch (error) {
        console.warn('Failed to connect to Redis, falling back to memory cache:', error.message);
        this.redis = null;
      }
    } else {
      this.redis = null;
    }
  }

  async intercept(context: ExecutionContext, next: CallHandler): Promise<Observable<any>> {
    const request = context.switchToHttp().getRequest();
    const key = this.getCacheKey(request);

    // If Redis is available, try to get cached data from Redis
    if (this.redis) {
      try {
        const cachedData = await this.redis.get(key);
        if (cachedData) {
          return of(JSON.parse(cachedData));
        }
      } catch (error) {
        console.warn('Redis get error, falling back to memory cache:', error.message);
      }
    } 
    // Otherwise, use memory cache
    else {
      const now = Date.now();
      const cached = this.memoryCache.get(key);
      if (cached && cached.expiry > now) {
        return of(cached.data);
      }
      // Clean expired items from memory cache periodically
      if (now % 10 === 0) { // Only clean on roughly 10% of requests to avoid overhead
        this.cleanExpiredCache();
      }
    }

    // If no cache, proceed with the request
    return next.handle().pipe(
      tap(async (data) => {
        // Try to cache the response
        const ttl = this.getTTL(request);
        if (this.redis) {
          try {
            await this.redis.setex(key, ttl, JSON.stringify(data));
          } catch (error) {
            console.warn('Redis set error, using memory cache instead:', error.message);
            this.memoryCache.set(key, {
              data,
              expiry: Date.now() + (ttl * 1000)
            });
          }
        } else {
          this.memoryCache.set(key, {
            data,
            expiry: Date.now() + (ttl * 1000)
          });
        }
      })
    );
  }

  private getCacheKey(request: any): string {
    const { method, url, user } = request;
    const userKey = user ? `:${user.id}` : '';
    return `cache:${method}:${url}${userKey}`;
  }

  private getTTL(request: any): number {
    // You can customize TTL based on the endpoint or method
    const { method } = request;
    switch (method) {
      case 'GET':
        return this.defaultTTL;
      case 'POST':
      case 'PUT':
      case 'DELETE':
        return 300; // 5 minutes for mutations
      default:
        return this.defaultTTL;
    }
  }

  private cleanExpiredCache(): void {
    const now = Date.now();
    for (const [key, value] of this.memoryCache.entries()) {
      if (value.expiry <= now) {
        this.memoryCache.delete(key);
      }
    }
  }
} 