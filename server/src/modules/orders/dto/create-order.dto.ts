import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsArray, ValidateNested, IsNotEmpty, IsNumber, Min } from 'class-validator';
import { Type } from 'class-transformer';

export class CreateOrderItemDto {
  @ApiProperty({ description: 'Product ID' })
  @IsString()
  @IsNotEmpty()
  productId: string;

  @ApiProperty({ description: 'Quantity ordered' })
  @IsNumber()
  @Min(1)
  quantity: number;

  @ApiProperty({ description: 'Unit price at time of order' })
  @IsNumber()
  @Min(0)
  unitPrice: number;
}

export class CreateOrderDto {
  @ApiProperty({ description: 'Customer ID' })
  @IsString()
  @IsNotEmpty()
  customerId: string;

  @ApiProperty({ description: 'Sales Representative ID' })
  @IsString()
  @IsNotEmpty()
  salesRepId: string;

  @ApiProperty({ description: 'Order items', type: [CreateOrderItemDto] })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CreateOrderItemDto)
  items: CreateOrderItemDto[];

  @ApiProperty({ description: 'Shipping address' })
  @IsString()
  @IsNotEmpty()
  shippingAddress: string;

  @ApiProperty({ description: 'Billing address' })
  @IsString()
  @IsNotEmpty()
  billingAddress: string;

  @ApiProperty({ description: 'Notes or special instructions' })
  @IsString()
  notes?: string;
} 