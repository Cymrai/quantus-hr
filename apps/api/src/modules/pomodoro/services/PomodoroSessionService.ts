import { PomodoroSession } from '../models/PomodoroSession';
import { TaskService } from '../../tasks/services/TaskService';

export class PomodoroSessionService {
  private taskService: TaskService;

  constructor() {
    this.taskService = new TaskService();
  }

  async getSessionById(sessionId: string): Promise<PomodoroSession | null> {
    // Implement Redis caching or direct DB query here
    return PomodoroSession.findByPk(sessionId);
  }

  async createSession({ taskId }: { taskId: string }): Promise<PomodoroSession> {
    const task = await this.taskService.getTaskById(taskId);
    if (!task || task.status !== 'in_progress') {
      throw new Error('Invalid task or task not in progress');
    }

    return PomodoroSession.create({ taskId });
  }

  async updateSessionStatus(sessionId: string, status: string): Promise<PomodoroSession | null> {
    const session = await this.getSessionById(sessionId);
    if (!session) {
      return null;
    }

    session.status = status;
    await session.save();
    return session;
  }
}