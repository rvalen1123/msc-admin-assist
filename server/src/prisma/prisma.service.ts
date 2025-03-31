import { Injectable, OnModuleInit, OnModuleDestroy, Logger } from '@nestjs/common';
import { PrismaClient, Prisma } from '@prisma/client';

@Injectable()
export class PrismaService extends PrismaClient implements OnModuleInit, OnModuleDestroy {
  private readonly logger = new Logger(PrismaService.name);

  constructor() {
    super();
    
    // Use middleware for query logging instead of events
    this.$use(async (params, next) => {
      const before = Date.now();
      const result = await next(params);
      const after = Date.now();
      
      this.logger.debug(`Query ${params.model}.${params.action} took ${after - before}ms`);
      
      return result;
    });
  }

  async onModuleInit() {
    try {
      await this.$connect();
      this.logger.log('Successfully connected to database');
    } catch (error) {
      this.logger.error('Failed to connect to database:', error);
      throw error;
    }
  }

  async onModuleDestroy() {
    try {
      await this.$disconnect();
      this.logger.log('Successfully disconnected from database');
    } catch (error) {
      this.logger.error('Failed to disconnect from database:', error);
      throw error;
    }
  }

  // Helper method to handle Prisma errors
  handleError(error: any): never {
    if (error instanceof Prisma.PrismaClientKnownRequestError) {
      switch (error.code) {
        case 'P2002':
          throw new Error('A unique constraint would be violated.');
        case 'P2025':
          throw new Error('Record not found.');
        default:
          throw new Error('Database operation failed.');
      }
    }
    throw error;
  }
} 