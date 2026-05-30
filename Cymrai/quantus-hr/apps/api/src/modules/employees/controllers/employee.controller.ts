/* QHR-35 */
import { Request, Response } from 'express';
import { ZodError } from 'zod';
import { EmployeeService } from '../services/employee.service';
import {
  CreateEmployeeSchema,
  UpdateEmployeeSchema,
  NotFoundError,
  ValidationError,
} from '../types/employee.type';

// ---------------------------------------------------------------------------
// Minimal structured logger shim.
// TODO: Replace with a shared Winston / Pino logger instance from the monorepo
//       logging package once it is available.
// ---------------------------------------------------------------------------
const logger = {
  error: (context: Record<string, unknown>, message: string) => {
    // Never log req.body — it may contain sensitive data.
    console.error(JSON.stringify({ ...context, message }));
  },
};

// ---------------------------------------------------------------------------
// Helper — translate a known error type to an HTTP status code + message
// ---------------------------------------------------------------------------
function resolveHttpError(
  err: unknown,
): { status: number; message: string } {
  if (err instanceof NotFoundError || err instanceof ValidationError) {
    return { status: err.statusCode, message: err.message };
  }
  if (err instanceof ZodError) {
    return { status: 400, message: err.errors.map((e) => e.message).join(', ') };
  }
  return { status: 500, message: 'Internal Server Error' };
}

export class EmployeeController {
  private employeeService: EmployeeService;

  /**
   * Constructor injection — accepts an optional EmployeeService so tests can
   * inject a mock without monkeypatching module imports.
   */
  constructor(employeeService: EmployeeService = new EmployeeService()) {
    this.employeeService = employeeService;
  }

  /**
   * GET /employees?page=1&limit=20
   *
   * Authentication & authorisation: enforced by middleware applied at the
   * router level (see employee.router.ts).
   * Sensitive fields (salary) are only returned to roles: HR_ADMIN, FINANCE
   * — enforced by the RBAC guard applied per-route.
   *
   * Pagination: `page` (default 1) and `limit` (default 20, max 100).
   */
  async getAllEmployees(req: Request, res: Response): Promise<void> {
    try {
      const page = parseInt(String(req.query.page ?? '1'), 10);
      const limit = parseInt(String(req.query.limit ?? '20'), 10);

      if (isNaN(page) || page < 1) {
        res.status(400).json({ error: '`page` must be a positive integer' });
        return;
      }
      if (isNaN(limit) || limit < 1) {
        res.status(400).json({ error: '`limit` must be a positive integer' });
        return;
      }

      const result = await this.employeeService.getAllEmployees({ page, limit });
      res.status(200).json(result);
    } catch (err) {
      logger.error({ route: 'getAllEmployees', err }, 'Unhandled error in getAllEmployees');
      const { status, message } = resolveHttpError(err);
      res.status(status).json({ error: message });
    }
  }

  /**
   * GET /employees/:id
   */
  async getEmployeeById(req: Request, res: Response): Promise<void> {
    const { id } = req.params;
    try {
      const employee = await this.employeeService.getEmployeeById(id);
      if (employee) {
        res.status(200).json(employee);
      } else {
        res.status(404).json({ error: 'Employee not found' });
      }
    } catch (err) {
      logger.error({ route: 'getEmployeeById', id, err }, 'Unhandled error in getEmployeeById');
      const { status, message } = resolveHttpError(err);
      res.status(status).json({ error: message });
    }
  }

  /**
   * POST /employees
   *
   * req.body is validated against CreateEmployeeSchema before being passed to
   * the service layer. Unknown / extra fields are stripped (Zod strict mode
   * could also be used to reject them outright — currently strip is used to
   * guard against mass-assignment attacks).
   */
  async createEmployee(req: Request, res: Response): Promise<void> {
    try {
      const parseResult = CreateEmployeeSchema.safeParse(req.body);
      if (!parseResult.success) {
        const message = parseResult.error.errors.map((e) => e.message).join(', ');
        res.status(400).json({ error: message });
        return;
      }

      const newEmployee = await this.employeeService.createEmployee(parseResult.data);
      res.status(201).json(newEmployee);
    } catch (err) {
      logger.error({ route: 'createEmployee', err }, 'Unhandled error in createEmployee');
      const { status, message } = resolveHttpError(err);
      res.status(status).json({ error: message });
    }
  }

  /**
   * PATCH /employees/:id
   *
   * req.body is validated against UpdateEmployeeSchema (all fields optional,
   * `id` never accepted) before being passed to the service layer.
   */
  async updateEmployee(req: Request, res: Response): Promise<void> {
    const { id } = req.params;
    try {
      const parseResult = UpdateEmployeeSchema.safeParse(req.body);
      if (!parseResult.success) {
        const message = parseResult.error.errors.map((e) => e.message).join(', ');
        res.status(400).json({ error: message });
        return;
      }

      const updatedEmployee = await this.employeeService.updateEmployee(id, parseResult.data);
      res.status(200).json(updatedEmployee);
    } catch (err) {
      logger.error({ route: 'updateEmployee', id, err }, 'Unhandled error in updateEmployee');
      const { status, message } = resolveHttpError(err);
      res.status(status).json({ error: message });
    }
  }

  /**
   * DELETE /employees/:id
   *
   * Returns 204 on success, 404 when the employee does not exist.
   */
  async deleteEmployee(req: Request, res: Response): Promise<void> {
    const { id } = req.params;
    try {
      await this.employeeService.deleteEmployee(id);
      res.status(204).send();
    } catch (err) {
      logger.error({ route: 'deleteEmployee', id, err }, 'Unhandled error in deleteEmployee');
      const { status, message } = resolveHttpError(err);
      res.status(status).json({ error: message });
    }
  }
}
