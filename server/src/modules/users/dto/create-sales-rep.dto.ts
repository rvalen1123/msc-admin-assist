import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsOptional, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';
import { CreateUserDto } from './create-user.dto';
import { UserRole } from '../enums/user-role.enum';

export class CreateSalesRepDto {
  @ApiProperty({ type: CreateUserDto })
  @ValidateNested()
  @Type(() => CreateUserDto)
  user: Omit<CreateUserDto, 'role'> & { role: UserRole.SALES };

  @ApiProperty({ example: 'Northeast', required: false })
  @IsString()
  @IsOptional()
  territory?: string;

  @ApiProperty({ example: 'New York', required: false })
  @IsString()
  @IsOptional()
  region?: string;

  @ApiProperty({ example: true, required: false })
  @IsOptional()
  active?: boolean;
} 