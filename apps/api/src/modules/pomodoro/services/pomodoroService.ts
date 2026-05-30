import { PomodoroSession, PomodoroStatus } from '@prisma/client';
import { prisma } from '../../../lib/prisma';
import { ConflictError, NotFoundError } from '../errors/pomodoroErrors';

class PomodoroService {
  async startPomodoroSession(userId: string): Promise<PomodoroSession> {
    // Guard against duplicate active sessions — returns 409 if one already exists.
    const existingSession = await prisma.pomodoroSession.findFirst({
      where: { userId, status: PomodoroStatus.ACTIVE },
    });

    if (existingSession) {
      throw new ConflictError('An active Pomodoro session already exists for this user');
    }

    const pomodoroSession = await prisma.pomodoroSession.create({
      data: {
        userId,
        startTime: new Date(),
        endTime: null,
        status: PomodoroStatus.ACTIVE,
      },
    });

    return pomodoroSession;
  }

  async stopPomodoroSession(userId: string): Promise<void> {
    const activeSession = await prisma.pomodoroSession.findFirst({
      where: { userId, status: PomodoroStatus.ACTIVE },
    });

    if (!activeSession) {
      throw new NotFoundError('No active Pomodoro session found');
    }

    await prisma.pomodoroSession.update({
      where: { id: activeSession.id },
      data: { endTime: new Date(), status: PomodoroStatus.COMPLETED },
    });
  }
}

export default PomodoroService;
