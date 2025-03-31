import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { APP_GUARD } from '@nestjs/core';
import { ThrottlerGuard, ThrottlerModule, ThrottlerModuleOptions } from '@nestjs/throttler';
import { PrismaModule } from './prisma/prisma.module';
import { LoggerModule } from 'nestjs-pino';
import * as path from 'path';

// Import your feature modules here
import { AuthModule } from './modules/auth/auth.module';
import { UsersModule } from './modules/users/users.module';
import { CustomersModule } from './modules/customers/customers.module';
import { ProductsModule } from './modules/products/products.module';
import { FormsModule } from './modules/forms/forms.module';
import { OrdersModule } from './modules/orders/orders.module';

@Module({
  imports: [
    // Configuration
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: [
        `.env.${process.env.NODE_ENV || 'development'}`,
        '.env',
      ],
    }),
    
    // Database
    PrismaModule,
    
    // Rate limiting
    ThrottlerModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (config: ConfigService): ThrottlerModuleOptions => ({
        throttlers: [{
          ttl: config.get('THROTTLE_TTL'),
          limit: config.get('THROTTLE_LIMIT'),
        }],
      })
    }),
    // Logging
    LoggerModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (config: ConfigService) => {
        const isProd = config.get('NODE_ENV') === 'production';
        return {
          pinoHttp: {
            level: isProd ? 'info' : 'debug',
            transport: isProd ? undefined : { target: 'pino-pretty' },
            redact: ['req.headers.authorization'],
            customProps: () => ({
              context: 'HTTP',
            }),
          },
        };
      },
    }),
    
    // Feature modules - uncomment as you implement them
     AuthModule,
     UsersModule,
     CustomersModule,
     ProductsModule,
     FormsModule,
     OrdersModule,
  ],
  providers: [
    // Global guards
    {
      provide: APP_GUARD,
      useClass: ThrottlerGuard,
    },
  ],
})
export class AppModule {}