import { EmployeeRepository } from '../repositories/employee.repository';
import { Employee } from '../interfaces/employee.interface';

// [MAJOR] Replaced `any` with the concrete Employee interface.
export class EmployeeService {
  // [MINOR] Dependency injected via constructor so tests can supply mocks.
  private employeeRepository: EmployeeRepository;

  constructor(employeeRepository: EmployeeRepository) {
    this.employeeRepository = employeeRepository;
  }

  // [MAJOR] Accepts pagination parameters; defaults kept here for clarity.
  async getAllEmployees(page = 1, limit = 20): Promise<Employee[]> {
    const skip = (page - 1) * limit;
    // [MINOR] No try/catch: let repository errors propagate with their original
    //   stack traces intact rather than swallowing them.
    return this.employeeRepository.findAll(skip, limit);
  }

  async getEmployeeById(id: number): Promise<Employee | null> {
    // [MINOR] No try/catch: let repository errors propagate with their original
    //   stack traces intact rather than swallowing them.
    return this.employeeRepository.findOne(id);
  }
}

// TODO: [MAJOR] Add unit tests for EmployeeService (mock EmployeeRepository) covering:
//   - getAllEmployees returns the repository result
//   - getAllEmployees passes correct skip/take values for various page/limit combos
//   - getEmployeeById returns an employee when found
//   - getEmployeeById returns null when not found
//   - repository errors propagate without being swallowed
