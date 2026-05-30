import { prisma } from '../../../config/prisma';
import { Employee } from '../interfaces/employee.interface';

// [MAJOR] Replaced `any` with the concrete Employee interface.
export class EmployeeRepository {
  // [MAJOR] findAll accepts pagination parameters to avoid unbounded queries.
  async findAll(skip: number, take: number): Promise<Employee[]> {
    // [MINOR] Let errors propagate naturally so the original stack trace is preserved.
    return prisma.employee.findMany({ skip, take }) as Promise<Employee[]>;
  }

  async findOne(id: number): Promise<Employee | null> {
    // [MINOR] Let errors propagate naturally so the original stack trace is preserved.
    return prisma.employee.findUnique({ where: { id } }) as Promise<Employee | null>;
  }
}

// TODO: [MAJOR] Add unit tests for EmployeeRepository (mock prisma client) covering:
//   - findAll returns paginated results
//   - findOne returns an employee when found
//   - findOne returns null when not found
//   - prisma errors propagate without being swallowed
