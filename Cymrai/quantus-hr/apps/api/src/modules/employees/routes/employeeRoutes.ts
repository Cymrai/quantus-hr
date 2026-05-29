/* QHR-38 */
import { Router } from 'express';
import EmployeeController from '../controllers/employeeController';

const router = Router();
const employeeController = new EmployeeController();

router.get('/', employeeController.getAllEmployees);
router.get('/:id', employeeController.getEmployeeById);
router.post('/', employeeController.createEmployee);
router.put('/:id', employeeController.updateEmployee);
router.delete('/:id', employeeController.deleteEmployee);

export default router;