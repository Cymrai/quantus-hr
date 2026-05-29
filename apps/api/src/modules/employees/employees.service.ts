import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Employee } from './entities/employee.entity';
import { CreateEmployeeDto } from './dto/create-employee.dto';

@Injectable()
export class EmployeesService {
  constructor(@InjectRepository(Employee) private readonly repo: Repository<Employee>) {}

  create(dto: CreateEmployeeDto) { return this.repo.save(this.repo.create(dto)); }

  findAll(orgId: string) { return this.repo.find({ where: { organizationId: orgId } }); }

  async findOne(id: string) {
    const emp = await this.repo.findOne({ where: { id } });
    if (!emp) throw new NotFoundException('Employee not found');
    return emp;
  }

  async update(id: string, data: Partial<Employee>) {
    await this.findOne(id);
    await this.repo.update(id, data);
    return this.findOne(id);
  }

  findByOrganization(orgId: string) {
    return this.repo.find({ where: { organizationId: orgId, status: 'active' as any } });
  }

  findDirectReports(managerId: string) {
    return this.repo.find({ where: { managerId } });
  }
}
