import { Exclude, Expose } from 'class-transformer';
import { IsDate, IsString } from 'class-validator';

@Exclude()
export class PerformanceScoreDTO {
  @Expose()
  @IsString()
  public modelType: string;

  @Expose()
  @IsDate()
  public period: Date;

  @Expose()
  public score: number;
}

@Exclude()
export class PerformanceScoreHistoryDTO {
  @Expose()
  @IsString()
  public modelType: string;

  @Expose()
  @IsDate()
  public period: Date;

  @Expose()
  public score: number;
}