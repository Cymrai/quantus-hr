import { Router } from 'express';
import { PomodoroController } from '../controllers/PomodoroController';

const router = Router();
const pomodoroController = new PomodoroController();

router.get('/pomodoro/session/:sessionId', pomodoroController.getPomodoroSession);
router.post('/pomodoro/session', pomodoroController.createPomodoroSession);
router.put('/pomodoro/session/:sessionId', pomodoroController.updatePomodoroSession);

export default router;