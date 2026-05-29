import { Request, Response } from 'express';
import PomodoroService from '../services/pomodoroService';

class PomodoroController {
  private pomodoroService: PomodoroService;

  constructor() {
    this.pomodoroService = new PomodoroService();
  }

  async startPomodoro(req: Request, res: Response) {
    try {
      const userId = req.user?.id; // Assuming user is authenticated and attached to request
      if (!userId) {
        return res.status(401).json({ message: 'Unauthorized' });
      }
      const pomodoroSession = await this.pomodoroService.startPomodoroSession(userId);
      res.status(201).json(pomodoroSession);
    } catch (error) {
      console.error('Error starting Pomodoro session:', error);
      res.status(500).json({ message: 'Internal Server Error' });
    }
  }

  async stopPomodoro(req: Request, res: Response) {
    try {
      const userId = req.user?.id; // Assuming user is authenticated and attached to request
      if (!userId) {
        return res.status(401).json({ message: 'Unauthorized' });
      }
      await this.pomodoroService.stopPomodoroSession(userId);
      res.status(204).send();
    } catch (error) {
      console.error('Error stopping Pomodoro session:', error);
      res.status(500).json({ message: 'Internal Server Error' });
    }
  }
}

export default PomodoroController;