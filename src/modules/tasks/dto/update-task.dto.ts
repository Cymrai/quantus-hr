import { IsNotEmpty, IsOptional, IsDecimal, Min, Max } from 'class-validator';

export class UpdateTaskDto {
  @IsOptional()
  title?: string;

  @IsOptional()
  description?: string;

  @IsOptional()
  dueDate?: Date;

  @IsOptional()
  status?: string;

  @IsDecimal({ decimal_digits: '1-2' })
  @Min(0.1)
  @Max(5.0)
  qualityWeight?: number;

  @IsDecimal({ decimal_digits: '1-2' })
  @Min(0.1)
  @Max(5.0)
  complexityMultiplier?: number;
}