import { Module } from '@nestjs/common';
import { TestController } from './test.controller';
import { TestService } from './test.service';
import { PrismaModule } from '../../prisma/prisma.module';
import { UsersModule } from '../users/users.module';
import { CustomersModule } from '../customers/customers.module';
import { ProductsModule } from '../products/products.module';

@Module({
  imports: [
    PrismaModule, 
    UsersModule,
    CustomersModule,
    ProductsModule
  ],
  controllers: [TestController],
  providers: [TestService],
})
export class TestModule {} 