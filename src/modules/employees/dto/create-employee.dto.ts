import { IsDate, IsEnum, IsNotEmpty, IsOptional, IsString } from 'class-validator';
import { EmploymentType } from '../types/employment-type.enum';

export class CreateEmployeeDto {
  @IsNotEmpty()
  @IsString()
  full_name: string;

  @IsNotEmpty()
  @IsString()
  job_title: string;

  @IsNotEmpty()
  @IsString()
  department: string;

  @IsOptional()
  @IsString()
  performance_model_id?: string;

  @IsEnum(EmploymentType)
  employment_type: EmploymentType;

  @IsDate()
  start_date: Date;
}