import { PrismaClient } from '@prisma/client';
import { CreateEmployeeDto } from '../dto/create-employee.dto';
import { UpdateEmployeeDto } from '../dto/update-employee.dto';

export class EmployeeRepository extends PrismaClient {
  public async create(data: CreateEmployeeDto) {
    return await this.employee_profiles.create({ data });
  }

  public async findAll(params: any) {
    const { tenant_id, ...query } = params;
    return await this.employee_profiles.findMany({ where: { tenant_id, ...query }, skip: query.skip, take: query.take });
  }

  public async findOne(params: any) {
    const { tenant_id, id } = params;
    return await this.employee_profiles.findUnique({ where: { tenant_id, id } });
  }

  public async update(id: string, data: UpdateEmployeeDto) {
    return await this.employee_profiles.update({ where: { id }, data });
  }

  public async softDelete(id: string) {
    const deleted = await this.employee_profiles.update({ where: { id }, data: { deactivated_at: new Date() } });
    return !!deleted;
  }
}