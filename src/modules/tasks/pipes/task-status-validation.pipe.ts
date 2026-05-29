import { PipeTransform, Injectable, BadRequestException } from '@nestjs/common';
import { isEnum } from 'class-validator';

@Injectable()
export class TaskStatusValidationPipe implements PipeTransform {
  private readonly allowedStatuses = ['todo', 'in_progress', 'done'];

  transform(value: any) {
    if (!isEnum(value, this.allowedStatuses)) {
      throw new BadRequestException('Invalid status');
    }
    return value;
  }
}