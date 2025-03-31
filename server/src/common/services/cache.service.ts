import { Injectable } from '@nestjs/common';
import { Redis } from 'ioredis';

@Injectable()
export class CacheService {
  private readonly redis: Redis | null;
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

  async clearAllCaches(): Promise<{ redisCleared: boolean; memoryCleared: boolean }> {
    const result = {
      redisCleared: false,
      memoryCleared: false
    };

    // Clear Redis cache if available
    if (this.redis) {
      try {
        await this.redis.flushall();
        result.redisCleared = true;
      } catch (error) {
        console.error('Failed to clear Redis cache:', error);
      }
    }

    // Clear memory cache
    this.memoryCache.clear();
    result.memoryCleared = true;

    return result;
  }
} 