import { Router } from 'express';
import { historyController } from '../controllers/history.controller.js';
import { requireAuth } from '../middleware/auth.middleware.js';

const router = Router();

router.use(requireAuth);

router.get('/', historyController.listAnalyses);
router.get('/:id', historyController.getAnalysisById);
router.delete('/:id', historyController.deleteAnalysis);

export default router;
