import { IsNotEmpty, IsUUID } from 'class-validator';

export class PausePomodoroSessionDto {
  @IsNotEmpty()
  @IsUUID()
  userId: string;
}