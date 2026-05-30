import { Injectable } from '@nestjs/common';
import { CreateEmployeeDto } from '../dto/create-employee.dto';
import { UpdateEmployeeDto } from '../dto/update-employee.dto';
import { EmployeeRepository } from '../repositories/employee.repository';

@Injectable()
export class EmployeeService {
  private readonly employeeRepository: EmployeeRepository;

  constructor() {
    this.employeeRepository = new EmployeeRepository();
  }

  public async createEmployee(tenant_id: string, data: CreateEmployeeDto) {
    return await this.employeeRepository.create({ tenant_id, ...data });
  }

  public async getEmployees(tenant_id: string, query: any) {
    return await this.employeeRepository.findAll({ tenant_id, ...query });
  }

  public async getEmployeeById(tenant_id: string, id: string) {
    return await this.employeeRepository.findOne({ tenant_id, id });
  }

  public async updateEmployee(tenant_id: string, id: string, data: UpdateEmployeeDto) {
    const existingEmployee = await this.employeeRepository.findOne({ tenant_id, id });
    if (!existingEmployee) return null;
    return await this.employeeRepository.update(id, data);
  }

  public async deleteEmployee(tenant_id: string, id: string) {
    const deleted = await this.employeeRepository.softDelete(id);
    return deleted ? true : false;
  }
}