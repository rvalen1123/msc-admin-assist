import { Injectable, OnModuleInit, OnModuleDestroy, Logger } from '@nestjs/common';
import { PrismaClient, Prisma } from '@prisma/client';
import { ConfigService } from '@nestjs/config';
import { INestApplication } from '@nestjs/common';

@Injectable()
export class PrismaService extends PrismaClient implements OnModuleInit, OnModuleDestroy {
  private readonly logger = new Logger(PrismaService.name);

  constructor(private configService: ConfigService) {
    super({
      log: [
        { emit: 'event', level: 'query' },
        { emit: 'stdout', level: 'info' },
        { emit: 'stdout', level: 'warn' },
        { emit: 'stdout', level: 'error' },
      ],
    });
  }

  async onModuleInit() {
    await this.$connect();
    this.logger.log('PrismaService initialized, database connection established');

    // Log queries in development
    if (this.configService.get('NODE_ENV') !== 'production') {
      (this.$on as any)('query', (e: Prisma.QueryEvent) => {
        this.logger.debug(`Query: ${e.query}`);
        this.logger.debug(`Duration: ${e.duration}ms`);
      });
    }
  }

  async onModuleDestroy() {
    await this.$disconnect();
    this.logger.log('Database connection closed');
  }

  async enableShutdownHooks(app: INestApplication) {
    process.on('beforeExit', async () => {
      await app.close();
    });
  }

  async cleanDatabase() {
    if (this.configService.get('NODE_ENV') === 'production') {
      throw new Error('This operation is not allowed in production');
    }
    
    // Add logic for truncating tables for testing if needed
  }
}