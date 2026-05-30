import { prisma } from '../../../config/prisma';

export class EmployeeRepository {
  async findAll(): Promise<any[]> {
    try {
      return await prisma.employee.findMany();
    } catch (error) {
      throw new Error('Failed to fetch employees', { cause: error });
    }
  }

  async findOne(id: number): Promise<any | null> {
    if (!id || id <= 0) {
      throw new Error('Invalid ID');
    }

    try {
      return await prisma.employee.findUnique({ where: { id } });
    } catch (error) {
      throw new Error('Failed to fetch employee by ID', { cause: error });
    }
  }
}