import { Request, Response } from 'express';
import { EmployeeService } from '../services/employee.service';
import { CreateEmployeeDto } from '../dto/create-employee.dto';
import { UpdateEmployeeDto } from '../dto/update-employee.dto';
import { validate } from 'class-validator';
import { plainToInstance } from 'class-transformer';
import { HttpException, HttpStatus } from '@nestjs/common';

export class EmployeeController {
  private readonly employeeService: EmployeeService;

  constructor() {
    this.employeeService = new EmployeeService();
  }

  public createEmployee = async (req: Request, res: Response) => {
    const { tenant_id, ...data } = req.body;
    if (!tenant_id || !req.user?.role === 'admin') {
      throw new HttpException('Unauthorized', HttpStatus.UNAUTHORIZED);
    }

    const dto = plainToInstance(CreateEmployeeDto, data);
    const errors = await validate(dto);
    if (errors.length > 0) {
      throw new HttpException({ message: 'Invalid input', errors }, HttpStatus.BAD_REQUEST);
    }

    const employee = await this.employeeService.createEmployee(tenant_id, dto);
    res.status(HttpStatus.CREATED).json(employee);
  };

  public getEmployees = async (req: Request, res: Response) => {
    if (!['admin', 'manager'].includes(req.user?.role)) {
      throw new HttpException('Unauthorized', HttpStatus.UNAUTHORIZED);
    }

    const employees = await this.employeeService.getEmployees(tenant_id, req.query);
    res.status(HttpStatus.OK).json(employees);
  };

  public getEmployeeById = async (req: Request, res: Response) => {
    if (!['admin', 'manager'].includes(req.user?.role)) {
      throw new HttpException('Unauthorized', HttpStatus.UNAUTHORIZED);
    }

    const employee = await this.employeeService.getEmployeeById(tenant_id, req.params.id);
    if (!employee) {
      throw new HttpException('Employee not found', HttpStatus.NOT_FOUND);
    }

    res.status(HttpStatus.OK).json(employee);
  };

  public updateEmployee = async (req: Request, res: Response) => {
    if (!req.user?.role === 'admin') {
      throw new HttpException('Unauthorized', HttpStatus.UNAUTHORIZED);
    }

    const dto = plainToInstance(UpdateEmployeeDto, req.body);
    const errors = await validate(dto);
    if (errors.length > 0) {
      throw new HttpException({ message: 'Invalid input', errors }, HttpStatus.BAD_REQUEST);
    }

    const updatedEmployee = await this.employeeService.updateEmployee(tenant_id, req.params.id, dto);
    if (!updatedEmployee) {
      throw new HttpException('Employee not found', HttpStatus.NOT_FOUND);
    }

    res.status(HttpStatus.OK).json(updatedEmployee);
  };

  public deleteEmployee = async (req: Request, res: Response) => {
    if (!req.user?.role === 'admin') {
      throw new HttpException('Unauthorized', HttpStatus.UNAUTHORIZED);
    }

    const deletedEmployee = await this.employeeService.deleteEmployee(tenant_id, req.params.id);
    if (!deletedEmployee) {
      throw new HttpException('Employee not found', HttpStatus.NOT_FOUND);
    }

    res.status(HttpStatus.NO_CONTENT).send();
  };
}