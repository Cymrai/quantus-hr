import { Router } from 'express';
import { EmployeeController } from '../controllers/employee.controller';

const router = Router();
const employeeController = new EmployeeController();

router.get('/', employeeController.getAllEmployees);
router.get('/:id', employeeController.getEmployeeById);

export default router;