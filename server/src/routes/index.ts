import { Router } from 'express';
import authRoutes from './auth.routes.js';
import userRoutes from './user.routes.js';
import boundaryRoutes from './boundary.routes.js';
import analyzeRoutes from './analyze.routes.js';
import historyRoutes from './history.routes.js';
import healthRoutes from './health.routes.js';
import chatRoutes from './chat.routes.js';

const router = Router();

router.use('/health', healthRoutes);
router.use('/auth', authRoutes);
router.use('/users', userRoutes);
router.use('/boundaries', boundaryRoutes);
router.use('/analyze', analyzeRoutes);
router.use('/analyses', historyRoutes);
router.use('/ai', chatRoutes);

export default router;
