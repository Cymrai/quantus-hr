import { IsString, IsOptional, IsEnum } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { PlanTier } from '../entities/organization.entity';

export class CreateOrganizationDto {
  @ApiProperty() @IsString() name: string;
  @ApiProperty() @IsString() slug: string;
  @ApiProperty({ required: false }) @IsOptional() @IsString() industry?: string;
  @ApiProperty({ enum: PlanTier, required: false }) @IsOptional() @IsEnum(PlanTier) plan?: PlanTier;
}
