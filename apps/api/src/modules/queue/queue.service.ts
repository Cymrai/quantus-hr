import { Injectable, OnModuleDestroy } from '@nestjs/common';
import { InjectQueue } from '@nestjs/bullmq';
import { Queue } from 'bullmq';
import {
  SCORE_RECALC_QUEUE,
  WEBHOOK_DELIVERY_QUEUE,
  POMODORO_SESSION_QUEUE,
} from './queue.constants';

@Injectable()
export class QueueService implements OnModuleDestroy {
  constructor(
    @InjectQueue(SCORE_RECALC_QUEUE) private scoreRecalcQueue: Queue,
    @InjectQueue(WEBHOOK_DELIVERY_QUEUE) private webhookDeliveryQueue: Queue,
    @InjectQueue(POMODORO_SESSION_QUEUE) private pomodoroSessionQueue: Queue,
  ) {}

  async healthCheck(): Promise<{ status: string; detail?: string }> {
    const queues = [
      this.scoreRecalcQueue,
      this.webhookDeliveryQueue,
      this.pomodoroSessionQueue,
    ];
    try {
      const timeout = new Promise<never>((_, reject) =>
        setTimeout(() => reject(new Error('Health check timed out')), 5000),
      );
      await Promise.race([
        Promise.all(queues.map((q) => q.waitUntilReady())),
        timeout,
      ]);
      return { status: 'ok' };
    } catch (err: any) {
      return { status: 'error', detail: err.message };
    }
  }

  async onModuleDestroy() {
    await Promise.all([
      this.scoreRecalcQueue.close(),
      this.webhookDeliveryQueue.close(),
      this.pomodoroSessionQueue.close(),
    ]);
  }
}
