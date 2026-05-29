import { Controller, Post, Get, Body, Param, NotFoundException, BadRequestException } from '@nestjs/common';
import { PomodoroService } from './pomodoro.service';
import { CreatePomodoroSessionDto } from './dto/create-pomodoro-session.dto';
import { CompletePomodoroSessionDto } from './dto/complete-pomodoro-session.dto';
import { ResumePomodoroSessionDto } from './dto/resume-pomodoro-session.dto';
import { PausePomodoroSessionDto } from './dto/pause-pomodoro-session.dto';

@Controller('pomodoro')
export class PomodoroController {
  constructor(private readonly pomodoroService: PomodoroService) {}

  @Post('session')
  async create(@Body() createPomodoroSessionDto: CreatePomodoroSessionDto) {
    try {
      const session = await this.pomodoroService.createSession(createPomodoroSessionDto);
      return session;
    } catch (error) {
      throw new BadRequestException('Failed to create Pomodoro session');
    }
  }

  @Get('session')
  async findOne(@Param('userId') userId: string) {
    const session = await this.pomodoroService.getSession(userId);
    if (!session) {
      throw new NotFoundException('No active Pomodoro session found');
    }
    return session;
  }

  @Post('session/complete')
  async complete(@Body() completePomodoroSessionDto: CompletePomodoroSessionDto) {
    try {
      await this.pomodoroService.completeSession(completePomodoroSessionDto);
    } catch (error) {
      throw new BadRequestException('Failed to complete Pomodoro session');
    }
  }

  @Post('session/pause')
  async pause(@Body() pausePomodoroSessionDto: PausePomodoroSessionDto) {
    try {
      await this.pomodoroService.pauseSession(pausePomodoroSessionDto);
    } catch (error) {
      throw new BadRequestException('Failed to pause Pomodoro session');
    }
  }

  @Post('session/resume')
  async resume(@Body() resumePomodoroSessionDto: ResumePomodoroSessionDto) {
    try {
      await this.pomodoroService.resumeSession(resumePomodoroSessionDto);
    } catch (error) {
      throw new BadRequestException('Failed to resume Pomodoro session');
    }
  }
}