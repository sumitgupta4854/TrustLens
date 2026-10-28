import { Router } from 'express';
import { userController } from '../controllers/user.controller.js';
import { requireAuth } from '../middleware/auth.middleware.js';
import { validateBody } from '../middleware/validate.middleware.js';
import { updateProfileSchema } from '../validators/auth.schema.js';

const router = Router();

router.use(requireAuth);

router.get('/me', userController.getProfile);
router.patch('/me', validateBody(updateProfileSchema), userController.updateProfile);
router.delete('/me', userController.deleteAccount);

export default router;
