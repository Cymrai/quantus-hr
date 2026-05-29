import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

class PomodoroModel {
  async createPomodoroSession(userId: string) {
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
      console.error('Error creating Pomodoro session:', error);
      throw new Error('Failed to create Pomodoro session');
    }
  }

  async updatePomodoroSession(sessionId: string, endTime: Date) {
    try {
      await prisma.pomodoroSession.update({
        where: { id: sessionId },
        data: { endTime, status: 'COMPLETED' },
      });
    } catch (error) {
      console.error('Error updating Pomodoro session:', error);
      throw new Error('Failed to update Pomodoro session');
    }
  }
}

export default PomodoroModel;