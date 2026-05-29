import { prisma } from '../../../config/prisma';

export class EmployeeRepository {
  async findAll(): Promise<any[]> {
    try {
      return await prisma.employee.findMany();
    } catch (error) {
      throw new Error('Failed to fetch employees');
    }
  }

  async findOne(id: number): Promise<any | null> {
    try {
      return await prisma.employee.findUnique({ where: { id } });
    } catch (error) {
      throw new Error('Failed to fetch employee by ID');
    }
  }
}