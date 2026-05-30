import { IsNotEmpty, IsString, IsUUID } from 'class-validator';

export class CreatePomodoroSessionDto {
  @IsNotEmpty()
  @IsString()
  taskId: string;

  @IsNotEmpty()
  @IsUUID()
  userId: string;
}