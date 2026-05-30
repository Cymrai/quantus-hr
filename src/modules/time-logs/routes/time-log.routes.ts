/**
 * @file time-log.routes.ts
 * @description Routes for handling CRUD operations on time logs.
 */
import { Router } from 'express';
import { TimeLogController } from '../controllers/time-log.controller';
import { authenticateToken } from '../../auth/middleware/authenticate-token';
import { authorizeEmployee } from '../../auth/middleware/authorize-employee';
import { authorizeManager } from '../../auth/middleware/authorize-manager';

const router = Router();
const timeLogController = new TimeLogController();

router.post('/time-logs', authenticateToken, (req, res) => timeLogController.createTimeLog(req, res));
router.get('/time-logs', authenticateToken, authorizeManager, (req, res) => timeLogController.getTimeLogs(req, res));
router.get('/time-logs/:id', authenticateToken, authorizeEmployee, (req, res) => timeLogController.getTimeLogById(req, res));
router.put('/time-logs/:id', authenticateToken, authorizeEmployee, (req, res) => timeLogController.updateTimeLog(req, res));
router.delete('/time-logs/:id', authenticateToken, authorizeManager, (req, res) => timeLogController.deleteTimeLog(req, res));

export default router;