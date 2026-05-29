import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export class EmployeeRepository {
  async findAll() {
    try {
      return await prisma.employee.findMany();
    } catch (error) {
      throw new Error('Failed to fetch employees');
    }
  }

  async findOne(id: string) {
    try {
      return await prisma.employee.findUnique({ where: { id } });
    } catch (error) {
      throw new Error('Failed to fetch employee by ID');
    }
  }
}