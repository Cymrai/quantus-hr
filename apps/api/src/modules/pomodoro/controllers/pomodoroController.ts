import { Request, Response } from 'express';
import PomodoroService from '../services/pomodoroService';
import { NotFoundError, ConflictError } from '../errors/pomodoroErrors';

class PomodoroController {
  private pomodoroService: PomodoroService;

  // Accept PomodoroService as a constructor parameter to enable dependency injection in tests.
  constructor(pomodoroService: PomodoroService = new PomodoroService()) {
    this.pomodoroService = pomodoroService;
  }

  async startPomodoro(req: Request, res: Response) {
    const userId = req.user?.id;
    if (!userId) {
      return res.status(401).json({ message: 'Unauthorized' });
    }

    try {
      const pomodoroSession = await this.pomodoroService.startPomodoroSession(userId);
      return res.status(201).json(pomodoroSession);
    } catch (error) {
      console.error('Error starting Pomodoro session:', error);
      if (error instanceof ConflictError) {
        return res.status(409).json({ message: error.message });
      }
      return res.status(500).json({ message: 'Internal Server Error' });
    }
  }

  async stopPomodoro(req: Request, res: Response) {
    const userId = req.user?.id;
    if (!userId) {
      return res.status(401).json({ message: 'Unauthorized' });
    }

    try {
      await this.pomodoroService.stopPomodoroSession(userId);
      return res.status(204).send();
    } catch (error) {
      console.error('Error stopping Pomodoro session:', error);
      if (error instanceof NotFoundError) {
        return res.status(404).json({ message: error.message });
      }
      return res.status(500).json({ message: 'Internal Server Error' });
    }
  }
}

export default PomodoroController;
