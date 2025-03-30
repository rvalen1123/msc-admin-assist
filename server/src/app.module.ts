import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ScheduleModule } from '@nestjs/schedule';
import { EventEmitterModule } from '@nestjs/event-emitter';
import { ThrottlerModule } from '@nestjs/throttler';
import { CacheInterceptor } from './common/interceptors/cache.interceptor';

// Import modules
import { AuthModule } from './modules/auth/auth.module';
import { UsersModule } from './modules/users/users.module';
import { CustomersModule } from './modules/customers/customers.module';
import { ProductsModule } from './modules/products/products.module';
import { FormsModule } from './modules/forms/forms.module';
import { OrdersModule } from './modules/orders/orders.module';
import { CommonModule } from './modules/common/common.module';

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

    // Database
    TypeOrmModule.forRoot({
      type: 'mssql',
      host: process.env.AZURE_SQL_HOST,
      port: parseInt(process.env.AZURE_SQL_PORT || '1433'),
      username: process.env.AZURE_SQL_USERNAME,
      password: process.env.AZURE_SQL_PASSWORD,
      database: process.env.AZURE_SQL_DATABASE,
      options: {
        encrypt: true, // For Azure SQL
        trustServerCertificate: false, // For Azure SQL
        enableArithAbort: true,
        connectTimeout: 30000, // 30 seconds
      },
      autoLoadEntities: true,
      synchronize: process.env.NODE_ENV !== 'production',
      logging: process.env.NODE_ENV === 'development',
    }),

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
  ],
  providers: [
    {
      provide: 'CACHE_INTERCEPTOR',
      useClass: CacheInterceptor,
    },
  ],
})
export class AppModule {} 