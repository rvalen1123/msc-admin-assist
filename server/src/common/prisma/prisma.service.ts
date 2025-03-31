import { Injectable, OnModuleInit, OnModuleDestroy } from '@nestjs/common';
import { PrismaClient, Prisma } from '@prisma/client';

@Injectable()
export class PrismaService extends PrismaClient implements OnModuleInit, OnModuleDestroy {
  constructor() {
    super();
  }

  async onModuleInit() {
    await this.$connect();
    
    // Add query logging using $use instead of $on
    this.$use(async (params, next) => {
      const before = Date.now();
      const result = await next(params);
      const after = Date.now();
      
      console.log(`Query ${params.model}.${params.action} took ${after - before}ms`);
      
      return result;
    });
  }

  async onModuleDestroy() {
    await this.$disconnect();
  }
} 