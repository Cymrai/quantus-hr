import { IsString, IsUUID, IsOptional, IsEnum, IsDateString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { PerformanceModel } from '../entities/employee.entity';

export class CreateEmployeeDto {
  @ApiProperty() @IsUUID() userId: string;
  @ApiProperty() @IsUUID() organizationId: string;
  @ApiProperty({ required: false }) @IsOptional() @IsUUID() teamId?: string;
  @ApiProperty({ required: false }) @IsOptional() @IsUUID() managerId?: string;
  @ApiProperty({ required: false }) @IsOptional() @IsString() jobTitle?: string;
  @ApiProperty({ required: false }) @IsOptional() @IsString() department?: string;
  @ApiProperty({ enum: PerformanceModel, required: false }) @IsOptional() @IsEnum(PerformanceModel) performanceModel?: PerformanceModel;
  @ApiProperty({ required: false }) @IsOptional() @IsDateString() startDate?: string;
}
