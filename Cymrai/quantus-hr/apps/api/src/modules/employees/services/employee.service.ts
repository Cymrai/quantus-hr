/* QHR-35 */
import { EmployeeRepository } from '../repositories/employee.repository';
import { IEmployee } from '../types/employee.type';

export class EmployeeService {
  private employeeRepository: EmployeeRepository;

  constructor() {
    this.employeeRepository = new EmployeeRepository();
  }

  async getAllEmployees(): Promise<IEmployee[]> {
    return await this.employeeRepository.findAll();
  }

  async getEmployeeById(id: string): Promise<IEmployee | null> {
    return await this.employeeRepository.findById(id);
  }

  async createEmployee(employeeData: IEmployee): Promise<IEmployee> {
    return await this.employeeRepository.create(employeeData);
  }

  async updateEmployee(id: string, employeeData: Partial<IEmployee>): Promise<IEmployee | null> {
    const existingEmployee = await this.employeeRepository.findById(id);
    if (existingEmployee) {
      return await this.employeeRepository.update(id, employeeData);
    } else {
      return null;
    }
  }

  async deleteEmployee(id: string): Promise<void> {
    const existingEmployee = await this.employeeRepository.findById(id);
    if (existingEmployee) {
      await this.employeeRepository.delete(id);
    } else {
      throw new Error('Employee not found');
    }
  }
}