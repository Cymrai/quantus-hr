/* QHR-35 */
import { IEmployee, CreateEmployeeDto, UpdateEmployeeDto } from '../types/employee.type';
import { prisma } from '../../../config/prisma';

// ---------------------------------------------------------------------------
// Pagination helpers
// ---------------------------------------------------------------------------

export interface PaginationOptions {
  /** 1-based page number. Defaults to 1. */
  page?: number;
  /**
   * Number of records per page. Defaults to 20. Maximum is 100.
   * Values above 100 are clamped to 100.
   */
  limit?: number;
}

export interface PaginatedResult<T> {
  data: T[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

// ---------------------------------------------------------------------------
// Repository
// ---------------------------------------------------------------------------

export class EmployeeRepository {
  /**
   * Constructor injection — accepts an optional Prisma client so tests can
   * inject a mock without monkeypatching module imports.
   */
  constructor(private readonly db = prisma) {}

  /**
   * Returns a paginated list of employees.
   * Default page size: 20. Maximum page size: 100.
   */
  async findAll(
    { page = 1, limit = 20 }: PaginationOptions = {},
  ): Promise<PaginatedResult<IEmployee>> {
    const safePage = Math.max(1, page);
    const safeLimit = Math.min(Math.max(1, limit), 100);
    const skip = (safePage - 1) * safeLimit;

    const [data, total] = await Promise.all([
      this.db.employee.findMany({ skip, take: safeLimit }),
      this.db.employee.count(),
    ]);

    return {
      data: data as IEmployee[],
      total,
      page: safePage,
      limit: safeLimit,
      totalPages: Math.ceil(total / safeLimit),
    };
  }

  async findById(id: string): Promise<IEmployee | null> {
    return (await this.db.employee.findUnique({ where: { id } })) as IEmployee | null;
  }

  /**
   * Creates a new employee record.
   * Accepts CreateEmployeeDto — `id` must NOT be supplied by the caller;
   * the database generates it.
   */
  async create(employeeData: CreateEmployeeDto): Promise<IEmployee> {
    return (await this.db.employee.create({ data: employeeData })) as IEmployee;
  }

  /**
   * Updates an existing employee record.
   * The existence check is intentionally removed from the repository layer.
   * If the record does not exist Prisma throws a P2025 error, which the
   * service layer catches and translates into a NotFoundError (single DB
   * round-trip, no N+1 anti-pattern).
   */
  async update(id: string, employeeData: UpdateEmployeeDto): Promise<IEmployee> {
    return (await this.db.employee.update({
      where: { id },
      data: employeeData,
    })) as IEmployee;
  }

  /**
   * Deletes an employee record.
   * Same reasoning as update — let Prisma surface P2025; the service handles
   * it as a NotFoundError (single DB round-trip).
   */
  async delete(id: string): Promise<void> {
    await this.db.employee.delete({ where: { id } });
  }
}
