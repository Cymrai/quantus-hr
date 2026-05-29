import { EmployeeRepository } from '../repositories/employee.repository';

export class EmployeeService {
  private employeeRepository: EmployeeRepository;

  constructor() {
    this.employeeRepository = new EmployeeRepository();
  }

  async getAllEmployees(): Promise<any[]> {
    try {
      return await this.employeeRepository.findAll();
    } catch (error) {
      throw new Error('Failed to fetch employees');
    }
  }

  async getEmployeeById(id: number): Promise<any | null> {
    try {
      return await this.employeeRepository.findOne(id);
    } catch (error) {
      throw new Error('Failed to fetch employee by ID');
    }
  }
}