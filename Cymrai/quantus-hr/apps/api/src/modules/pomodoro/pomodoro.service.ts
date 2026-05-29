import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRedis, Redis } from '@nestjs-modules/ioredis';
import { CreatePomodoroSessionDto } from './dto/create-pomodoro-session.dto';
import { CompletePomodoroSessionDto } from './dto/complete-pomodoro-session.dto';
import { ResumePomodoroSessionDto } from './dto/resume-pomodoro-session.dto';
import { PausePomodoroSessionDto } from './dto/pause-pomodoro-session.dto';
import { TimeLogsService } from '../time-logs/time-logs.service'; // Assuming this service exists for creating time logs
import { SocketGateway } from '../socket.gateway'; // Assuming this gateway exists to emit events

@Injectable()
export class PomodoroService {
  constructor(
    @InjectRedis() private readonly redis: Redis,
    private readonly timeLogsService: TimeLogsService,
    private readonly socketGateway: SocketGateway,
  ) {}

  async createSession(createPomodoroSessionDto: CreatePomodoroSessionDto) {
    const session = { ...createPomodoroSessionDto, startedAt: new Date(), pausedAt: null, elapsedSeconds: 0 };
    await this.redis.set(`pomodoro:${createPomodoroSessionDto.userId}`, JSON.stringify(session), 'EX', 7200); // TTL of 2 hours
    await this.socketGateway.emit('pomodoro:state_changed', session);
    return session;
  }

  async getSession(userId: string) {
    const session = await this.redis.get(`pomodoro:${userId}`);
    if (!session) return null;
    return JSON.parse(session);
  }

  async completeSession(completePomodoroSessionDto: CompletePomodoroSessionDto) {
    const session = await this.getSession(completePomodoroSessionDto.userId);
    if (!session) throw new NotFoundException('No active Pomodoro session found');
    await this.redis.del(`pomodoro:${completePomodoroSessionDto.userId}`);
    await this.timeLogsService.createLog({ userId, taskId: session.taskId, duration: session.elapsedSeconds });
    await this.socketGateway.emit('pomodoro:state_changed', null);
  }

  async pauseSession(pausePomodoroSessionDto: PausePomodoroSessionDto) {
    const session = await this.getSession(pausePomodoroSessionDto.userId);
    if (!session) throw new NotFoundException('No active Pomodoro session found');
    const pausedAt = new Date();
    await this.redis.set(`pomodoro:${pausePomodoroSessionDto.userId}`, JSON.stringify({ ...session, pausedAt }));
    await this.socketGateway.emit('pomodoro:state_changed', { ...session, pausedAt });
  }

  async resumeSession(resumePomodoroSessionDto: ResumePomodoroSessionDto) {
    const session = await this.getSession(resumePomodoroSessionDto.userId);
    if (!session) throw new NotFoundException('No active Pomodoro session found');
    const currentTime = new Date();
    const pausedAt = new Date(session.pausedAt);
    const elapsedSeconds = Math.floor((currentTime - pausedAt) / 1000);
    await this.redis.set(`pomodoro:${resumePomodoroSessionDto.userId}`, JSON.stringify({ ...session, pausedAt: null, elapsedSeconds }));
    await this.socketGateway.emit('pomodoro:state_changed', { ...session, pausedAt: null, elapsedSeconds });
  }
}