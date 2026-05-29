import { Router } from 'express';
import authModule from './auth';

const apiRouter = Router();
apiRouter.use('/v1', authModule);

export default apiRouter;