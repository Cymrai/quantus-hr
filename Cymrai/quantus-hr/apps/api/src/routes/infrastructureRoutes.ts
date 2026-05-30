import { Router } from 'express';
import { provisionInfrastructure } from '../controllers/infrastructureController';

const router = Router();

/**
 * @route POST /api/infrastructure/provision
 * @description Provision AWS baseline infrastructure including ECS, RDS, ElastiCache, and S3.
 * @access Private (requires authentication)
 */
router.post('/provision', provisionInfrastructure);

export default router;