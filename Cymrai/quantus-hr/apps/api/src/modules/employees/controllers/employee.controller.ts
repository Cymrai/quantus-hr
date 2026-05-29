/* QHR-35 */
import { Request, Response } from 'express';
import { EmployeeService } from '../services/employee.service';

export class EmployeeController {
  private employeeService: EmployeeService;

  constructor() {
    this.employeeService = new EmployeeService();
  }

  async getAllEmployees(req: Request, res: Response) {
    try {
      const employees = await this.employeeService.getAllEmployees();
      res.status(200).json(employees);
    } catch (error) {
      res.status(500).json({ error: 'Internal Server Error' });
    }
  }

  async getEmployeeById(req: Request, res: Response) {
    const { id } = req.params;
    try {
      const employee = await this.employeeService.getEmployeeById(id);
      if (employee) {
        res.status(200).json(employee);
      } else {
        res.status(404).json({ error: 'Employee not found' });
      }
    } catch (error) {
      res.status(500).json({ error: 'Internal Server Error' });
    }
  }

  async createEmployee(req: Request, res: Response) {
    const employeeData = req.body;
    try {
      const newEmployee = await this.employeeService.createEmployee(employeeData);
      res.status(201).json(newEmployee);
    } catch (error) {
      res.status(500).json({ error: 'Internal Server Error' });
    }
  }

  async updateEmployee(req: Request, res: Response) {
    const { id } = req.params;
    const employeeData = req.body;
    try {
      const updatedEmployee = await this.employeeService.updateEmployee(id, employeeData);
      if (updatedEmployee) {
        res.status(200).json(updatedEmployee);
      } else {
        res.status(404).json({ error: 'Employee not found' });
      }
    } catch (error) {
      res.status(500).json({ error: 'Internal Server Error' });
    }
  }

  async deleteEmployee(req: Request, res: Response) {
    const { id } = req.params;
    try {
      await this.employeeService.deleteEmployee(id);
      res.status(204).send();
    } catch (error) {
      res.status(500).json({ error: 'Internal Server Error' });
    }
  }
}