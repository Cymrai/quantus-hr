import { Module } from '@nestjs/common';
import { BullModule } from '@nestjs/bullmq';
import { ConfigService } from '@nestjs/config';
import { QueueController } from './queue.controller';
import { QueueService } from './queue.service';
import {
  SCORE_RECALC_QUEUE,
  WEBHOOK_DELIVERY_QUEUE,
  POMODORO_SESSION_QUEUE,
} from './queue.constants';

@Module({
  imports: [
    BullModule.forRootAsync({
      useFactory: (configService: ConfigService) => ({
        connection: {
          host: configService.get<string>('REDIS_HOST', 'localhost'),
          port: parseInt(configService.get<string>('REDIS_PORT', '6379'), 10),
          password: configService.get<string>('REDIS_PASSWORD'),
        },
      }),
      inject: [ConfigService],
    }),
    BullModule.registerQueue({ name: SCORE_RECALC_QUEUE }),
    BullModule.registerQueue({ name: WEBHOOK_DELIVERY_QUEUE }),
    BullModule.registerQueue({ name: POMODORO_SESSION_QUEUE }),
  ],
  controllers: [QueueController],
  providers: [QueueService],
  exports: [BullModule],
})
export class QueueModule {}
