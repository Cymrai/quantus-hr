import { Router, RequestHandler } from 'express';
import { provisionInfrastructure } from '../controllers/infrastructureController';
import {
  authMiddleware,
  adminOnlyMiddleware,
} from '../middleware/auth.middleware';

const router: Router = Router();

/**
 * @route POST /api/infrastructure/provision
 * @description Provision AWS baseline infrastructure including ECS, RDS, ElastiCache, and S3.
 * @access Private — requires valid JWT + admin role
 */
router.post(
  '/provision',
  authMiddleware as RequestHandler,
  adminOnlyMiddleware as RequestHandler,
  provisionInfrastructure,
);

export default router;
