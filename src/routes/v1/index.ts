import { Router } from 'express';

const router = Router();

// Routes
import authRoutes from './auth';
import userRoutes from './user';
import blogRoutes from './blog';
import likeRoutes from './like';
import commentRoutes from './comment';

// Root route
router.get('/', (req, res) => {
  res.status(200).json({
    message: 'API is live',
    status: 'ok',
    version: '1.0.0',
    timeStamp: new Date().toISOString(),
  });
});

router.use('/auth', authRoutes);
router.use('/users', userRoutes);
router.use('/blogs', blogRoutes);
router.use('/likes', likeRoutes);
router.use('/comments', commentRoutes);

export default router;
