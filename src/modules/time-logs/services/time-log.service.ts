/**
 * @file time-log.service.ts
 * @description Service for handling business logic related to time logs.
 */
import { TimeLogRepository } from '../repositories/time-log.repository';
import BullMQ from 'bullmq';

export class TimeLogService {
  private readonly timeLogRepo: TimeLogRepository;
  private readonly scoreRecalcQueue: BullMQ.Queue;

  constructor() {
    this.timeLogRepo = new TimeLogRepository();
    this.scoreRecalcQueue = new BullMQ('score-recalc', { connection: { host: 'localhost', port: 6379 } });
  }

  /**
   * Create a new time log entry.
   */
  async createTimeLog(timeLogData: any) {
    return await this.timeLogRepo.create(timeLogData);
  }

  /**
   * Get all time logs, optionally filtered by employee, date range, task, and billable flag.
   */
  async getTimeLogs(filters: any) {
    filters.tenant_id = filters.tenant_id || ''; // Ensure tenant filter is always present
    return await this.timeLogRepo.findAll(filters);
  }

  /**
   * Get a single time log entry by ID.
   */
  async getTimeLogById(id: string, tenant_id: string) {
    return await this.timeLogRepo.findOne({ id, tenant_id });
  }

  /**
   * Update an existing time log entry.
   */
  async updateTimeLog(id: string, updates: any) {
    const updated = await this.timeLogRepo.update(id, updates);
    if (updated) {
      return await this.getTimeLogById(id, updates.tenant_id);
    }
    return null;
  }

  /**
   * Delete a time log entry by ID.
   */
  async deleteTimeLog(id: string, tenant_id: string) {
    return await this.timeLogRepo.delete({ id, tenant_id });
  }

  /**
   * Enqueue a score recalculation job for the specified employee.
   */
  async enqueueScoreRecalc(employee_id: string) {
    await this.scoreRecalcQueue.add('recalc', { employee_id }, { removeOnComplete: true, removeOnFail: true });
  }
}