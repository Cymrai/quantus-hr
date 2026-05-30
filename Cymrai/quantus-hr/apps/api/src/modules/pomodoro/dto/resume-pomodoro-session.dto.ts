import { IsNotEmpty, IsUUID } from 'class-validator';

export class ResumePomodoroSessionDto {
  @IsNotEmpty()
  @IsUUID()
  userId: string;
}