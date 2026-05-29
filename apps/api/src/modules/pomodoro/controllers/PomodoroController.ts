import { Request, Response } from 'express';
import { PomodoroSessionService } from '../services/PomodoroSessionService';
import { TimeLogService } from '../../time-logs/services/TimeLogService';
import { TaskService } from '../../tasks/services/TaskService';
import RedisClient from '../../../lib/redis';

export class PomodoroController {
  private pomodoroSessionService: PomodoroSessionService;
  private timeLogService: TimeLogService;
  private taskService: TaskService;
  private redisClient: typeof RedisClient;

  constructor() {
    this.pomodoroSessionService = new PomodoroSessionService();
    this.timeLogService = new TimeLogService();
    this.taskService = new TaskService();
    this.redisClient = RedisClient;
  }

  async getPomodoroSession(req: Request, res: Response) {
    try {
      const sessionId = req.params.sessionId;
      const session = await this.pomodoroSessionService.getSessionById(sessionId);
      if (!session) {
        return res.status(404).json({ message: 'Session not found' });
      }
      return res.status(200).json(session);
    } catch (error) {
      console.error('Error fetching Pomodoro session:', error);
      return res.status(500).json({ message: 'Internal server error' });
    }
  }

  async createPomodoroSession(req: Request, res: Response) {
    try {
      const taskId = req.body.taskId;
      if (!taskId) {
        return res.status(400).json({ message: 'Task ID is required' });
      }

      const task = await this.taskService.getTaskById(taskId);
      if (!task || task.status !== 'in_progress') {
        return res.status(400).json({ message: 'Invalid task or task not in progress' });
      }

      const session = await this.pomodoroSessionService.createSession({ taskId });
      await this.redisClient.set(`pomodoro_session:${session.id}`, JSON.stringify(session));

      return res.status(201).json(session);
    } catch (error) {
      console.error('Error creating Pomodoro session:', error);
      return res.status(500).json({ message: 'Internal server error' });
    }
  }

  async updatePomodoroSession(req: Request, res: Response) {
    try {
      const sessionId = req.params.sessionId;
      const { status } = req.body;

      if (!status || !['idle', 'work', 'short_break', 'long_break', 'paused'].includes(status)) {
        return res.status(400).json({ message: 'Invalid session status' });
      }

      const session = await this.pomodoroSessionService.updateSessionStatus(sessionId, status);
      if (!session) {
        return res.status(404).json({ message: 'Session not found' });
      }

      await this.redisClient.set(`pomodoro_session:${sessionId}`, JSON.stringify(session));

      return res.status(200).json(session);
    } catch (error) {
      console.error('Error updating Pomodoro session:', error);
      return res.status(500).json({ message: 'Internal server error' });
    }
  }
}