import { IsString, IsNotEmpty, IsObject, ValidateNested, IsOptional } from 'class-validator';
import { Type } from 'class-transformer';
import { SubmissionStatus } from '@prisma/client';

export class CreateFormSubmissionDto {
  @IsString()
  @IsNotEmpty()
  templateId: string;

  @IsString()
  @IsNotEmpty()
  customerId: string;

  @IsObject()
  @ValidateNested()
  @Type(() => Object)
  data: Record<string, any>;

  @IsString()
  @IsOptional()
  status?: SubmissionStatus;
} 