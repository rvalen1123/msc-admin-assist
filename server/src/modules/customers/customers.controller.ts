import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';
import { CustomersService } from './customers.service';
import { CreateCustomerDto } from './dto/create-customer.dto';
import { UpdateCustomerDto } from './dto/update-customer.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { UserRole } from '@prisma/client';

@ApiTags('customers')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('customers')
export class CustomersController {
  constructor(private readonly customersService: CustomersService) {}

  @Post()
  @Roles(UserRole.ADMIN, UserRole.SALES)
  @ApiOperation({ summary: 'Create a new customer' })
  @ApiResponse({ status: 201, description: 'Customer created successfully' })
  @ApiResponse({ status: 400, description: 'Invalid input data' })
  create(@Body() createCustomerDto: CreateCustomerDto) {
    return this.customersService.create(createCustomerDto);
  }

  @Get()
  @Roles(UserRole.ADMIN, UserRole.SALES)
  @ApiOperation({ summary: 'Get all customers' })
  @ApiResponse({ status: 200, description: 'Return all customers' })
  findAll() {
    return this.customersService.findAll();
  }

  @Get(':id')
  @Roles(UserRole.ADMIN, UserRole.SALES)
  @ApiOperation({ summary: 'Get a customer by id' })
  @ApiResponse({ status: 200, description: 'Return the customer' })
  @ApiResponse({ status: 404, description: 'Customer not found' })
  findOne(@Param('id') id: string) {
    return this.customersService.findOne(id);
  }

  @Patch(':id')
  @Roles(UserRole.ADMIN, UserRole.SALES)
  @ApiOperation({ summary: 'Update a customer' })
  @ApiResponse({ status: 200, description: 'Customer updated successfully' })
  @ApiResponse({ status: 404, description: 'Customer not found' })
  update(@Param('id') id: string, @Body() updateCustomerDto: UpdateCustomerDto) {
    return this.customersService.update(id, updateCustomerDto);
  }

  @Delete(':id')
  @Roles(UserRole.ADMIN)
  @ApiOperation({ summary: 'Delete a customer' })
  @ApiResponse({ status: 200, description: 'Customer deleted successfully' })
  @ApiResponse({ status: 404, description: 'Customer not found' })
  remove(@Param('id') id: string) {
    return this.customersService.remove(id);
  }

  @Get(':id/contacts')
  @Roles(UserRole.ADMIN, UserRole.SALES)
  @ApiOperation({ summary: 'Get all contacts for a customer' })
  @ApiResponse({ status: 200, description: 'Return all contacts for the customer' })
  @ApiResponse({ status: 404, description: 'Customer not found' })
  findCustomerContacts(@Param('id') id: string) {
    return this.customersService.findCustomerContacts(id);
  }
} 