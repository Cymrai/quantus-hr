import { Router } from 'express';
import { EmployeeController } from '../controllers/employee.controller';
import { EmployeeService } from '../services/employee.service';
import { EmployeeRepository } from '../repositories/employee.repository';
// TODO: [CRITICAL] Import and apply your JWT / auth middleware below before
//   merging.  Employee data is sensitive PII and must not be publicly accessible.
//   Example:
//     import { authenticate } from '../../../middleware/auth.middleware';
//     import { authorizeRoles } from '../../../middleware/roles.middleware';
//   Then add `authenticate, authorizeRoles('HR_ADMIN')` as route middleware.

const router = Router();

// [MINOR] Dependencies are constructed here and injected so tests can supply mocks.
const employeeRepository = new EmployeeRepository();
const employeeService = new EmployeeService(employeeRepository);
const employeeController = new EmployeeController(employeeService);

// TODO: [CRITICAL] Protect these routes with authentication/authorization middleware, e.g.:
//   router.get('/', authenticate, authorizeRoles('HR_ADMIN'), employeeController.getAllEmployees.bind(employeeController));
//   router.get('/:id', authenticate, authorizeRoles('HR_ADMIN', 'EMPLOYEE'), employeeController.getEmployeeById.bind(employeeController));

// [CRITICAL] Methods are explicitly bound so `this` is correct when Express invokes them.
router.get('/', employeeController.getAllEmployees.bind(employeeController));
router.get('/:id', employeeController.getEmployeeById.bind(employeeController));

export default router;

// TODO: [MAJOR] Add integration tests for each route:
//   - GET /  returns 200 with paginated employee list
//   - GET /  respects page and limit query parameters
//   - GET /:id returns 200 for a valid existing id
//   - GET /:id returns 404 for a valid but non-existent id
//   - GET /:id returns 400 for id = 0, negative id, non-numeric id
//   - All routes return 401/403 when authentication is enforced
