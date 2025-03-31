import { IsString, IsNotEmpty, IsObject, ValidateNested, IsOptional, IsEnum } from 'class-validator';
import { Type } from 'class-transformer';
import { SubmissionStatus } from '../enums/submission-status.enum';

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

  @IsEnum(SubmissionStatus)
  @IsOptional()
  status?: SubmissionStatus;
} 