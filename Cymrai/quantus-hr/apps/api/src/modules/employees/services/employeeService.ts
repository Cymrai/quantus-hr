/* QHR-38 */
import { EmployeeModel } from '../models/EmployeeModel';
import { IEmployee } from '../types/IEmployee';

class EmployeeService {
  async getAllEmployees(): Promise<IEmployee[]> {
    try {
      const employees = await EmployeeModel.find();
      return employees;
    } catch (error) {
      throw new Error('Failed to fetch employees');
    }
  }

  async getEmployeeById(id: string): Promise<IEmployee | null> {
    try {
      const employee = await EmployeeModel.findById(id);
      return employee;
    } catch (error) {
      throw new Error('Failed to fetch employee');
    }
  }

  async createEmployee(employeeData: IEmployee): Promise<IEmployee> {
    try {
      const newEmployee = await EmployeeModel.create(employeeData);
      return newEmployee;
    } catch (error) {
      throw new Error('Failed to create employee');
    }
  }

  async updateEmployee(id: string, employeeData: IEmployee): Promise<IEmployee | null> {
    try {
      const updatedEmployee = await EmployeeModel.findByIdAndUpdate(id, employeeData, { new: true });
      return updatedEmployee;
    } catch (error) {
      throw new Error('Failed to update employee');
    }
  }

  async deleteEmployee(id: string): Promise<void> {
    try {
      await EmployeeModel.findByIdAndDelete(id);
    } catch (error) {
      throw new Error('Failed to delete employee');
    }
  }
}

export default EmployeeService;