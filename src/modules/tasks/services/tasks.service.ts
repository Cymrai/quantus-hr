import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateTaskDto } from '../dto/create-task.dto';
import { UpdateTaskDto } from '../dto/update-task.dto';
import { Task } from '../entities/task.entity';

@Injectable()
export class TasksService {
  constructor(
    @InjectRepository(Task)
    private readonly tasksRepository: Repository<Task>,
  ) {}

  async create(createTaskDto: CreateTaskDto): Promise<Task> {
    const task = this.tasksRepository.create(createTaskDto);
    return this.tasksRepository.save(task);
  }

  async findAll({ assignee, status }, page: number): Promise<Task[]> {
    const queryBuilder = this.tasksRepository.createQueryBuilder('task');
    if (assignee) {
      queryBuilder.andWhere('task.assignee_id = :assignee', { assignee });
    }
    if (status) {
      queryBuilder.andWhere('task.status = :status', { status });
    }
    return queryBuilder.skip((page - 1) * 10).take(10).getMany();
  }

  async findOne(id: string): Promise<Task> {
    const task = await this.tasksRepository.findOne({ where: { id } });
    if (!task) {
      throw new NotFoundException('Task not found');
    }
    return task;
  }

  async update(id: string, updateTaskDto: UpdateTaskDto): Promise<Task> {
    const task = await this.tasksRepository.preload({ id, ...updateTaskDto });
    if (!task) {
      throw new NotFoundException('Task not found');
    }
    return this.tasksRepository.save(task);
  }

  async remove(id: string): Promise<void> {
    const task = await this.findOne(id);
    if (task.externalRef) {
      throw new Error('Cannot delete tasks with external references');
    }
    await this.tasksRepository.softRemove(task);
  }
}