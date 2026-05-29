import { IsDate, IsEnum, IsOptional, IsString } from 'class-validator';
import { EmploymentType } from '../types/employment-type.enum';

export class UpdateEmployeeDto {
  @IsOptional()
  @IsString()
  full_name?: string;

  @IsOptional()
  @IsString()
  job_title?: string;

  @IsOptional()
  @IsString()
  department?: string;

  @IsOptional()
  @IsString()
  performance_model_id?: string;

  @IsEnum(EmploymentType)
  employment_type?: EmploymentType;

  @IsDate()
  start_date?: Date;
}