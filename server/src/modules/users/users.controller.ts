import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { UsersService } from './users.service';
import { User } from './entities/user.entity';
import { SalesRep } from './entities/sales-rep.entity';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { CreateSalesRepDto } from './dto/create-sales-rep.dto';
import { UserDto, SalesRepDto } from './dto/user.dto';

@ApiTags('users')
@Controller('users')
@UseGuards(JwtAuthGuard)
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post()
  @ApiOperation({ summary: 'Create a new user' })
  @ApiResponse({ status: 201, description: 'User created successfully', type: UserDto })
  async create(@Body() createUserDto: CreateUserDto): Promise<Omit<User, 'salesRep'>> {
    return this.usersService.create(createUserDto);
  }

  @Post('sales-rep')
  @ApiOperation({ summary: 'Create a new sales representative' })
  @ApiResponse({ status: 201, description: 'Sales rep created successfully', type: SalesRepDto })
  async createSalesRep(@Body() createSalesRepDto: CreateSalesRepDto): Promise<SalesRep> {
    const user = await this.usersService.create(createSalesRepDto.user);
    return this.usersService.createSalesRep(user.id, {
      territory: createSalesRepDto.territory,
      region: createSalesRepDto.region,
      active: createSalesRepDto.active ?? true
    });
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get a user by ID' })
  @ApiResponse({ status: 200, description: 'User found', type: UserDto })
  async findOne(@Param('id') id: string): Promise<Omit<User, 'salesRep'>> {
    return this.usersService.findById(id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update a user' })
  @ApiResponse({ status: 200, description: 'User updated successfully', type: UserDto })
  async update(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto): Promise<Omit<User, 'salesRep'>> {
    return this.usersService.update(id, updateUserDto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete a user' })
  @ApiResponse({ status: 200, description: 'User deleted successfully' })
  async remove(@Param('id') id: string): Promise<void> {
    return this.usersService.remove(id);
  }
} 