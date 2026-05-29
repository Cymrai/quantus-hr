import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { RedisClientType, createClient } from 'redis';
import BullMQ from 'bullmq';
import { ScoringService } from './scoring.service';
import { TimeLog } from './time-logs/time-log.model';
import { PerformanceScore } from './performance-score.model';

@Module({
  imports: [
    SequelizeModule.forFeature([TimeLog, PerformanceScore]),
    ConfigModule,
  ],
  providers: [ScoringService],
  exports: [ScoringService],
})
export class ScoringModule {
  constructor(private configService: ConfigService) {}

  onModuleInit() {
    const redisClient = createClient({ url: this.configService.get('REDIS_URL') });
    redisClient.connect().then(() => {
      BullMQ.setDefaultAdapter(redisClient);
    });
  }
}