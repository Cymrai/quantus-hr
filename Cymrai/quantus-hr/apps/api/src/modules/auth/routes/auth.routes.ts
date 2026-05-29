import { Router } from 'express';
import { LoginController } from '../controllers/login.controller';

const router = Router();
const loginController = new LoginController();

router.post('/login', (req, res) => loginController.login(req, res));

export default router;