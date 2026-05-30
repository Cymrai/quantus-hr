/**
 * @file time-log.controller.ts
 * @description Controller for handling CRUD operations on time logs.
 */
import { Request, Response } from 'express';
import { TimeLogService } from '../services/time-log.service';
import { validateHours } from '../../common/validators/validate-hours';
import { authenticateToken } from '../../auth/middleware/authenticate-token';
import { authorizeEmployee } from '../../auth/middleware/authorize-employee';
import { authorizeManager } from '../../auth/middleware/authorize-manager';
import { asyncHandler } from '../../common/utils/async-handler';

export class TimeLogController {
  private readonly timeLogService: TimeLogService;

  constructor() {
    this.timeLogService = new TimeLogService();
  }

  /**
   * Create a new time log entry.
   */
  createTimeLog = asyncHandler(async (req: Request, res: Response) => {
    const { tenant_id, employee_id, task_id, external_ref, description, logged_hours, billable, logged_date } = req.body;

    // Validate logged hours
    if (!validateHours(logged_hours)) {
      return res.status(400).json({ message: 'Logged hours must be between 0.25 and 24' });
    }

    const newTimeLog = await this.timeLogService.createTimeLog({
      tenant_id, employee_id, task_id, external_ref, description, logged_hours, billable, logged_date
    });

    // Enqueue score recalculation job
    await this.timeLogService.enqueueScoreRecalc(employee_id);

    res.status(201).json(newTimeLog);
  });

  /**
   * Get all time logs, optionally filtered by employee, date range, task, and billable flag.
   */
  getTimeLogs = asyncHandler(async (req: Request, res: Response) => {
    const filters = req.query;
    filters.tenant_id = req.user.tenant_id; // Filter logs by tenant

    const timeLogs = await this.timeLogService.getTimeLogs(filters);
    res.json(timeLogs);
  });

  /**
   * Get a single time log entry by ID.
   */
  getTimeLogById = asyncHandler(async (req: Request, res: Response) => {
    const id = req.params.id;
    const tenant_id = req.user.tenant_id; // Ensure the user is authorized to view this log

    const timeLog = await this.timeLogService.getTimeLogById(id, tenant_id);
    if (!timeLog) {
      return res.status(404).json({ message: 'Time log not found' });
    }
    res.json(timeLog);
  });

  /**
   * Update a time log entry by ID.
   */
  updateTimeLog = asyncHandler(async (req: Request, res: Response) => {
    const id = req.params.id;
    const { logged_hours } = req.body;

    // Validate logged hours
    if (!validateHours(logged_hours)) {
      return res.status(400).json({ message: 'Logged hours must be between 0.25 and 24' });
    }

    const updatedTimeLog = await this.timeLogService.updateTimeLog(id, req.body);
    if (!updatedTimeLog) {
      return res.status(404).json({ message: 'Time log not found' });
    }

    // Enqueue score recalculation job
    const timeLog = await this.timeLogService.getTimeLogById(id, req.user.tenant_id);
    if (timeLog && timeLog.employee_id === req.user.id) {
      await this.timeLogService.enqueueScoreRecalc(timeLog.employee_id);
    } else {
      return res.status(403).json({ message: 'Forbidden' });
    }

    res.json(updatedTimeLog);
  });

  /**
   * Delete a time log entry by ID.
   */
  deleteTimeLog = asyncHandler(async (req: Request, res: Response) => {
    const id = req.params.id;
    const tenant_id = req.user.tenant_id; // Ensure the user is authorized to delete this log

    const deleted = await this.timeLogService.deleteTimeLog(id, tenant_id);
    if (!deleted) {
      return res.status(404).json({ message: 'Time log not found' });
    }
    res.status(204).send();
  });
}