import { EmployeeRepository } from '../repositories/employee.repository';

export class EmployeeService {
  private employeeRepository: EmployeeRepository;

  constructor() {
    this.employeeRepository = new EmployeeRepository();
  }

  async getAllEmployees() {
    try {
      return await this.employeeRepository.findAll();
    } catch (error) {
      throw new Error('Failed to fetch employees');
    }
  }

  async getEmployeeById(id: string) {
    try {
      return await this.employeeRepository.findOne(id);
    } catch (error) {
      throw new Error('Failed to fetch employee by ID');
    }
  }
}