import { IsNotEmpty, IsUUID } from 'class-validator';

export class CompletePomodoroSessionDto {
  @IsNotEmpty()
  @IsUUID()
  userId: string;
}