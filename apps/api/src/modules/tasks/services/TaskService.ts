import { Task } from '../models/Task';

export class TaskService {
  async getTasksForUser(userId: string): Promise<Task[]> {
    return Task.findAll({ where: { assigneeId: userId, status: 'in_progress' } });
  }

  async getTaskById(taskId: string): Promise<Task | null> {
    return Task.findOne({ where: { id: taskId, status: 'in_progress' } });
  }
}