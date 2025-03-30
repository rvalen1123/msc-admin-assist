import { IsString, IsEmail, IsOptional, IsPhoneNumber, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';

export class CreateCustomerContactDto {
  @IsString()
  name: string;

  @IsString()
  @IsOptional()
  title?: string;

  @IsEmail()
  @IsOptional()
  email?: string;

  @IsPhoneNumber()
  @IsOptional()
  phone?: string;

  @IsOptional()
  isPrimary?: boolean;
}

export class CreateCustomerDto {
  @IsString()
  name: string;

  @IsEmail()
  email: string;

  @IsPhoneNumber()
  @IsOptional()
  phone?: string;

  @IsString()
  @IsOptional()
  company?: string;

  @IsString()
  @IsOptional()
  addressLine1?: string;

  @IsString()
  @IsOptional()
  addressLine2?: string;

  @IsString()
  @IsOptional()
  city?: string;

  @IsString()
  @IsOptional()
  state?: string;

  @IsString()
  @IsOptional()
  zipCode?: string;

  @IsString()
  @IsOptional()
  country?: string;

  @ValidateNested({ each: true })
  @Type(() => CreateCustomerContactDto)
  @IsOptional()
  contacts?: CreateCustomerContactDto[];
} 