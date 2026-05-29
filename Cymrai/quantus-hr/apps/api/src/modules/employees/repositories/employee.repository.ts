/* QHR-35 */
import { IEmployee } from '../types/employee.type';
import { prisma } from '../../../config/prisma';

export class EmployeeRepository {
  async findAll(): Promise<IEmployee[]> {
    return await prisma.employee.findMany();
  }

  async findById(id: string): Promise<IEmployee | null> {
    return await prisma.employee.findUnique({ where: { id } });
  }

  async create(employeeData: IEmployee): Promise<IEmployee> {
    return await prisma.employee.create({ data: employeeData });
  }

  async update(id: string, employeeData: Partial<IEmployee>): Promise<IEmployee | null> {
    const existingEmployee = await this.findById(id);
    if (existingEmployee) {
      return await prisma.employee.update({ where: { id }, data: employeeData });
    } else {
      return null;
    }
  }

  async delete(id: string): Promise<void> {
    await prisma.employee.delete({ where: { id } });
  }
}