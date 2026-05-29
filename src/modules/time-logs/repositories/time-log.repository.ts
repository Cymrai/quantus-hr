/**
 * @file time-log.repository.ts
 * @description Repository for handling database operations related to time logs.
 */
import { db } from '../../config/database';
import { QueryResult } from 'pg';

export class TimeLogRepository {
  /**
   * Create a new time log entry in the database.
   */
  async create(timeLogData: any): Promise<any> {
    const query = `
      INSERT INTO time_logs (tenant_id, employee_id, task_id, external_ref, description, logged_hours, billable, logged_date)
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
      RETURNING *;
    `;
    const values = [timeLogData.tenant_id, timeLogData.employee_id, timeLogData.task_id, timeLogData.external_ref, timeLogData.description, timeLogData.logged_hours, timeLogData.billable, timeLogData.logged_date];
    const result: QueryResult = await db.query(query, values);
    return result.rows[0];
  }

  /**
   * Find all time logs matching the specified filters.
   */
  async findAll(filters: any): Promise<any[]> {
    const query = `
      SELECT * FROM time_logs
      WHERE tenant_id = $1
      ${filters.employee_id ? 'AND employee_id = $2' : ''}
      ${filters.start_date && filters.end_date ? 'AND logged_date BETWEEN $3 AND $4' : ''}
      ${filters.task_id ? 'AND task_id = $5' : ''}
      ${filters.billable !== undefined ? 'AND billable = $6' : ''};
    `;
    const values = [filters.tenant_id, filters.employee_id || null, filters.start_date || null, filters.end_date || null, filters.task_id || null, filters.billable];
    const result: QueryResult = await db.query(query, values);
    return result.rows;
  }

  /**
   * Find a single time log by ID.
   */
  async findOne(filter: any): Promise<any> {
    const query = `
      SELECT * FROM time_logs
      WHERE id = $1 AND tenant_id = $2;
    `;
    const values = [filter.id, filter.tenant_id];
    const result: QueryResult = await db.query(query, values);
    return result.rows[0];
  }

  /**
   * Update an existing time log entry in the database.
   */
  async update(id: string, updates: any): Promise<boolean> {
    const query = `
      UPDATE time_logs
      SET task_id = $1, external_ref = $2, description = $3, logged_hours = $4, billable = $5, logged_date = $6, updated_at = NOW()
      WHERE id = $7 AND tenant_id = $8;
    `;
    const values = [updates.task_id || null, updates.external_ref || null, updates.description || null, updates.logged_hours, updates.billable, updates.logged_date, id, updates.tenant_id];
    const result: QueryResult = await db.query(query, values);
    return result.rowCount > 0;
  }

  /**
   * Delete a time log entry by ID.
   */
  async delete(filter: any): Promise<boolean> {
    const query = `
      DELETE FROM time_logs
      WHERE id = $1 AND tenant_id = $2;
    `;
    const values = [filter.id, filter.tenant_id];
    const result: QueryResult = await db.query(query, values);
    return result.rowCount > 0;
  }
}