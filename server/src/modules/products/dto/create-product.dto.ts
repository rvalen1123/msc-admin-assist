import { IsString, IsNumber, IsOptional, IsDecimal, Min } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateProductDto {
  @ApiProperty({ description: 'Name of the product' })
  @IsString()
  name: string;

  @ApiProperty({ description: 'ID of the manufacturer' })
  @IsString()
  manufacturerId: string;

  @ApiPropertyOptional({ description: 'Product description' })
  @IsString()
  @IsOptional()
  description?: string;

  @ApiPropertyOptional({ description: 'Product price', type: 'number' })
  @IsDecimal()
  @IsOptional()
  price?: number;

  @ApiPropertyOptional({ description: 'Product Q-code' })
  @IsString()
  @IsOptional()
  qCode?: string;

  @ApiPropertyOptional({ description: 'National ASP price', type: 'number' })
  @IsDecimal()
  @IsOptional()
  nationalAsp?: number;

  @ApiPropertyOptional({ description: 'MUE code' })
  @IsString()
  @IsOptional()
  mue?: string;
} 