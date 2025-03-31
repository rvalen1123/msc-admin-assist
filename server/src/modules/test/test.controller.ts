import { Controller, Post, Body, Delete } from '@nestjs/common';
import { TestService } from './test.service';
import { ApiTags, ApiOperation } from '@nestjs/swagger';
import { CreateUserDto } from '../users/dto/create-user.dto';
import { CreateCustomerDto } from '../customers/dto/create-customer.dto';
import { CreateProductDto } from '../products/dto/create-product.dto';

@ApiTags('test')
@Controller('test')
export class TestController {
  constructor(private readonly testService: TestService) {}

  @Post('seed')
  @ApiOperation({ summary: 'Seed test data (non-production only)' })
  async seedTestData(@Body() seedData: {
    users?: CreateUserDto[];
    customers?: CreateCustomerDto[];
    products?: CreateProductDto[];
    manufacturers?: { id: string; name: string; logo?: string }[];
  }) {
    // Check if we're in a non-production environment
    if (process.env.NODE_ENV === 'production') {
      throw new Error('Seeding is not allowed in production');
    }
    return this.testService.seedTestData(seedData);
  }

  @Delete('cleanup')
  @ApiOperation({ summary: 'Clean up test data (non-production only)' })
  async cleanupTestData() {
    // Check if we're in a non-production environment
    if (process.env.NODE_ENV === 'production') {
      throw new Error('Test data cleanup is not allowed in production');
    }
    return this.testService.cleanupTestData();
  }
} 