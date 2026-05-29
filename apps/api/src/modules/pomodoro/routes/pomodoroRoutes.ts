import { Router } from 'express';
import PomodoroController from '../controllers/pomodoroController';
import authMiddleware from '../../common/middlewares/authMiddleware';

const router = Router();
const pomodoroController = new PomodoroController();

router.post('/start', authMiddleware, (req, res) => pomodoroController.startPomodoro(req, res));
router.post('/stop', authMiddleware, (req, res) => pomodoroController.stopPomodoro(req, res));

export default router;