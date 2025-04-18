import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { ScheduleModule } from '@nestjs/schedule';
import { EventEmitterModule } from '@nestjs/event-emitter';
import { ThrottlerModule } from '@nestjs/throttler';
import { CacheInterceptor } from './common/interceptors/cache.interceptor';
import { CacheService } from './common/services/cache.service';
import { CacheController } from './common/controllers/cache.controller';

// Import modules
import { AuthModule } from './modules/auth/auth.module';
import { UsersModule } from './modules/users/users.module';
import { CustomersModule } from './modules/customers/customers.module';
import { ProductsModule } from './modules/products/products.module';
import { FormsModule } from './modules/forms/forms.module';
import { OrdersModule } from './modules/orders/orders.module';
import { CommonModule } from './modules/common/common.module';
import { TestModule } from './modules/test/test.module';
import { PrismaModule } from './prisma/prisma.module';

// Dynamically include modules based on environment
const environmentBasedModules = [];

// Only include TestModule in non-production environments
if (process.env.NODE_ENV !== 'production') {
  environmentBasedModules.push(TestModule);
}

@Module({
  imports: [
    // Configuration
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
    }),

    // Rate limiting
    ThrottlerModule.forRoot([{
      ttl: 60, // 1 minute
      limit: 100, // 100 requests per minute
    }]),

    // Task Scheduling
    ScheduleModule.forRoot(),

    // Event Emitter
    EventEmitterModule.forRoot(),

    // Feature Modules
    AuthModule,
    UsersModule,
    CustomersModule,
    ProductsModule,
    FormsModule,
    OrdersModule,
    CommonModule,
    PrismaModule,
    
    // Environment-specific modules
    ...environmentBasedModules,
  ],
  controllers: [CacheController],
  providers: [
    {
      provide: 'CACHE_INTERCEPTOR',
      useClass: CacheInterceptor,
    },
    CacheService,
  ],
})
export class AppModule {} 