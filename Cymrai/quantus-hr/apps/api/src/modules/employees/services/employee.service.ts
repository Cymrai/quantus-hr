/* QHR-35 */
import { EmployeeRepository, PaginationOptions, PaginatedResult } from '../repositories/employee.repository';
import {
  IEmployee,
  CreateEmployeeDto,
  UpdateEmployeeDto,
  NotFoundError,
} from '../types/employee.type';

// Prisma error code for "record not found" on update/delete
const PRISMA_NOT_FOUND_CODE = 'P2025';

/**
 * Checks whether an unknown thrown value is a Prisma "record not found" error.
 */
function isPrismaNotFound(err: unknown): boolean {
  return (
    typeof err === 'object' &&
    err !== null &&
    'code' in err &&
    (err as Record<string, unknown>).code === PRISMA_NOT_FOUND_CODE
  );
}

export class EmployeeService {
  private employeeRepository: EmployeeRepository;

  /**
   * Constructor injection — accepts an optional EmployeeRepository so tests
   * can inject a mock without monkeypatching module imports.
   */
  constructor(employeeRepository: EmployeeRepository = new EmployeeRepository()) {
    this.employeeRepository = employeeRepository;
  }

  /**
   * Returns a paginated list of employees.
   * Default page: 1, default limit: 20, maximum limit: 100.
   */
  async getAllEmployees(
    pagination: PaginationOptions = {},
  ): Promise<PaginatedResult<IEmployee>> {
    return this.employeeRepository.findAll(pagination);
  }

  async getEmployeeById(id: string): Promise<IEmployee | null> {
    return this.employeeRepository.findById(id);
  }

  /**
   * Creates a new employee from a validated DTO.
   * `id` is never accepted — the database generates it.
   */
  async createEmployee(employeeData: CreateEmployeeDto): Promise<IEmployee> {
    return this.employeeRepository.create(employeeData);
  }

  /**
   * Updates an existing employee.
   * A single existence check is performed here in the service layer.
   * The repository no longer performs its own check, eliminating the N+1
   * double-fetch anti-pattern.
   */
  async updateEmployee(
    id: string,
    employeeData: UpdateEmployeeDto,
  ): Promise<IEmployee> {
    const existing = await this.employeeRepository.findById(id);
    if (!existing) {
      throw new NotFoundError(`Employee with id '${id}' not found`);
    }
    try {
      return await this.employeeRepository.update(id, employeeData);
    } catch (err) {
      if (isPrismaNotFound(err)) {
        throw new NotFoundError(`Employee with id '${id}' not found`);
      }
      throw err;
    }
  }

  /**
   * Deletes an existing employee.
   * A single existence check is performed here in the service layer.
   * The repository no longer performs its own check, eliminating the N+1
   * double-fetch anti-pattern.
   */
  async deleteEmployee(id: string): Promise<void> {
    const existing = await this.employeeRepository.findById(id);
    if (!existing) {
      throw new NotFoundError(`Employee with id '${id}' not found`);
    }
    try {
      await this.employeeRepository.delete(id);
    } catch (err) {
      if (isPrismaNotFound(err)) {
        throw new NotFoundError(`Employee with id '${id}' not found`);
      }
      throw err;
    }
  }
}
