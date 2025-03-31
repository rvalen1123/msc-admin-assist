import { applyDecorators, UseInterceptors } from '@nestjs/common';
import { CacheInterceptor } from '../interceptors/cache.interceptor';

export function Cache(ttl?: number) {
  return applyDecorators(
    UseInterceptors(CacheInterceptor)
  );
} 