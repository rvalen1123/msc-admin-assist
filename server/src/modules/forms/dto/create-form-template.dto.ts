import { IsString, IsNotEmpty, IsOptional, IsObject, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';

export class CreateFormTemplateDto {
  @IsString()
  @IsNotEmpty()
  type: string;

  @IsString()
  @IsNotEmpty()
  title: string;

  @IsString()
  @IsOptional()
  description?: string;

  @IsObject()
  @ValidateNested()
  @Type(() => Object)
  schema: Record<string, any>;
} 