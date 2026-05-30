import { IsNotEmpty, IsOptional, IsDecimal, Min, Max } from 'class-validator';

export class CreateTaskDto {
  @IsNotEmpty()
  title: string;

  @IsOptional()
  description?: string;

  @IsOptional()
  dueDate?: Date;

  @IsDecimal({ decimal_digits: '1-2' })
  @Min(0.1)
  @Max(5.0)
  qualityWeight: number;

  @IsDecimal({ decimal_digits: '1-2' })
  @Min(0.1)
  @Max(5.0)
  complexityMultiplier: number;

  @IsOptional()
  externalRef?: string;
}