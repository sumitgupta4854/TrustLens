import { Router } from 'express';
import { boundaryController } from '../controllers/boundary.controller.js';
import { requireAuth } from '../middleware/auth.middleware.js';
import { validateBody } from '../middleware/validate.middleware.js';
import {
  createBoundarySchema,
  updateBoundarySchema,
} from '../validators/boundary.schema.js';

const router = Router();

router.use(requireAuth);

router.post('/', validateBody(createBoundarySchema), boundaryController.createBoundary);
router.get('/', boundaryController.listBoundaries);
router.get('/:id', boundaryController.getBoundaryById);
router.patch('/:id', validateBody(updateBoundarySchema), boundaryController.updateBoundary);
router.delete('/:id', boundaryController.deleteBoundary);

export default router;
