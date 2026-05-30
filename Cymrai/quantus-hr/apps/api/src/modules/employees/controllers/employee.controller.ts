import { Request, Response } from 'express';
import { EmployeeService } from '../services/employee.service';
import { Employee } from '../interfaces/employee.interface';

// TODO: [SUGGESTION] Add OpenAPI/Swagger annotations for both endpoints documenting
//   request parameters, response schemas (using EmployeeResponseDto), and error codes.

// TODO: [SUGGESTION] Define an EmployeeResponseDto that whitelists only safe fields
//   (e.g. id, name, department, title) and use Prisma `select` or a serialization
//   layer to strip sensitive fields (salary, SSN, contact info) before responding.

export class EmployeeController {
  // [MINOR] Dependency is accepted via constructor so tests can inject mocks.
  private employeeService: EmployeeService;

  constructor(employeeService: EmployeeService) {
    this.employeeService = employeeService;
  }

  // [MAJOR] getAllEmployees now accepts optional `page` and `limit` query params
  //   for offset pagination to avoid fetching the entire table at once.
  async getAllEmployees(req: Request, res: Response): Promise<void> {
    const page = Math.max(1, parseInt((req.query.page as string) ?? '1', 10) || 1);
    // Default page size: 20; maximum enforced page size: 100.
    const limit = Math.min(
      100,
      Math.max(1, parseInt((req.query.limit as string) ?? '20', 10) || 20),
    );

    try {
      const employees: Employee[] = await this.employeeService.getAllEmployees(page, limit);
      res.status(200).json(employees);
    } catch (error) {
      res.status(500).json({ error: 'Internal Server Error' });
    }
  }

  async getEmployeeById(req: Request, res: Response): Promise<void> {
    const id = parseInt(req.params.id, 10);

    // [MAJOR] Reject NaN, zero, and negative IDs.
    if (isNaN(id) || id <= 0) {
      res.status(400).json({ error: 'Invalid ID' });
      return;
    }

    try {
      const employee: Employee | null = await this.employeeService.getEmployeeById(id);
      if (employee) {
        res.status(200).json(employee);
      } else {
        res.status(404).json({ error: 'Employee not found' });
      }
    } catch (error) {
      res.status(500).json({ error: 'Internal Server Error' });
    }
  }
}

// TODO: [MAJOR] Add unit tests covering:
//   - getAllEmployees happy path
//   - getAllEmployees pagination boundary values
//   - getEmployeeById happy path
//   - getEmployeeById with id = 0, negative id, non-numeric id
//   - getEmployeeById when employee is not found
//   - error propagation (service throws) for both methods
