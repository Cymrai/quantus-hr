import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { RedisClientType, createClient } from 'redis';
import { v4 as uuidv4 } from 'uuid';
import { ClientProxyFactory } from '@nestjs/microservices';
import { InjectModel } from '@nestjs/sequelize';
import { Model, Sequelize } from 'sequelize-typescript';
import BullMQ, { Queue } from 'bullmq';
import * as moment from 'moment';
import { TimeLog } from '../time-logs/time-log.model';
import { PerformanceScore } from './performance-score.model';

@Injectable()
export class ScoringService {
  private readonly logger = new Logger(ScoringService.name);
  private redisClient: RedisClientType;
  private scoreRecalcQueue: Queue;

  constructor(
    @InjectModel(TimeLog) private timeLogModel: typeof TimeLog,
    @InjectModel(PerformanceScore) private performanceScoreModel: typeof PerformanceScore,
    private configService: ConfigService,
  ) {
    this.redisClient = createClient({ url: this.configService.get('REDIS_URL') });
    this.scoreRecalcQueue = new BullMQ.Queue('score-recalc', {
      connection: this.redisClient,
    });
  }

  async calculateScore(employeeId: string, modelType: string, periodStart: Date, periodEnd: Date): Promise<number> {
    const billableHours = await this.timeLogModel.sum('hours', {
      where: { employee_id: employeeId, date: { [Sequelize.Op.between]: [periodStart, periodEnd] }, is_billable: true },
    });

    const profile = await this.getEmployeeProfile(employeeId);
    if (!profile) throw new Error('Employee profile not found');

    const availableHours = profile.weekly_hours * (this.workingDaysInPeriod(periodStart, periodEnd) || 0);
    let utilisationRate = billableHours ? (billableHours / availableHours) * 100 : 0;
    utilisationRate = Math.min(Math.max(utilisationRate, 0), 100);

    const inputSnapshot = { billableHours, availableHours };
    await this.saveScore(employeeId, modelType, utilisationRate, periodStart, periodEnd, inputSnapshot);

    return utilisationRate;
  }

  private async getEmployeeProfile(employeeId: string): Promise<any> {
    // This method should fetch the employee profile from the database or another service.
    // For simplicity, it's mocked here.
    const profiles = [
      { id: '1', weekly_hours: 40 },
      { id: '2', weekly_hours: 35 },
    ];
    return profiles.find(profile => profile.id === employeeId);
  }

  private workingDaysInPeriod(startDate: Date, endDate: Date): number {
    const days = [];
    let currentDate = moment(startDate).startOf('day');
    while (currentDate.isSameOrBefore(endDate)) {
      if (currentDate.isoWeekday() <= 5) { // Monday is 1, ..., Friday is 5
        days.push(currentDate.toDate());
      }
      currentDate = moment(currentDate).add(1, 'days');
    }
    return days.length;
  }

  private async saveScore(employeeId: string, modelType: string, score: number, periodStart: Date, periodEnd: Date, inputSnapshot: any): Promise<void> {
    await this.performanceScoreModel.create({
      id: uuidv4(),
      tenant_id: 'default', // Assuming a default tenant for simplicity
      employee_id: employeeId,
      model_type: modelType,
      model_version: '1.0.0', // Hardcoded version for now
      score,
      period_start: periodStart,
      period_end: periodEnd,
      calculated_at: new Date(),
      input_snapshot,
    });
  }
}