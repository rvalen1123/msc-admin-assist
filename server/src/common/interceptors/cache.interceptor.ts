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

  constructor() {
    // Only initialize Redis if not in test mode
    if (process.env.NODE_ENV !== 'test') {
      this.redis = new Redis(process.env.REDIS_URL || 'redis://localhost:6379');
    } else {
      this.redis = null;
    }
  }

  async intercept(context: ExecutionContext, next: CallHandler): Promise<Observable<any>> {
    // Skip caching in test mode
    if (!this.redis) {
      return next.handle();
    }

    const request = context.switchToHttp().getRequest();
    const key = this.getCacheKey(request);

    // Try to get cached data
    const cachedData = await this.redis.get(key);
    if (cachedData) {
      return of(JSON.parse(cachedData));
    }

    // If no cache, proceed with the request
    return next.handle().pipe(
      tap(async (data) => {
        // Cache the response
        await this.redis.setex(
          key,
          this.getTTL(request),
          JSON.stringify(data)
        );
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
} 