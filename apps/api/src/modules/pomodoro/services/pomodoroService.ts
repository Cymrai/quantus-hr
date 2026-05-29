import { PrismaClient, PomodoroSession } from '@prisma/client';

const prisma = new PrismaClient();

class PomodoroService {
  async startPomodoroSession(userId: string): Promise<PomodoroSession> {
    try {
      const pomodoroSession = await prisma.pomodoroSession.create({
        data: {
          userId,
          startTime: new Date(),
          endTime: null,
          status: 'ACTIVE',
        },
      });
      return pomodoroSession;
    } catch (error) {
      console.error('Error starting Pomodoro session:', error);
      throw new Error('Failed to start Pomodoro session');
    }
  }

  async stopPomodoroSession(userId: string): Promise<void> {
    try {
      const activeSession = await prisma.pomodoroSession.findFirst({
        where: { userId, endTime: null },
      });
      if (!activeSession) {
        throw new Error('No active Pomodoro session found');
      }
      await prisma.pomodoroSession.update({
        where: { id: activeSession.id },
        data: { endTime: new Date(), status: 'COMPLETED' },
      });
    } catch (error) {
      console.error('Error stopping Pomodoro session:', error);
      throw new Error('Failed to stop Pomodoro session');
    }
  }
}

export default PomodoroService;