import { Router } from 'express';
import authRoutes from './routes/auth.routes';

const moduleRouter = Router();
moduleRouter.use('/auth', authRoutes);

export default moduleRouter;