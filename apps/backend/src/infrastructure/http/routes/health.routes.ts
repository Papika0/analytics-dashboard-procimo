import { Router } from 'express';
import { cache, dataGenerator } from './analytics.routes';

const router = Router();

/**
 * Health check endpoint
 */
router.get('/', async (_req, res) => {
  try {
    const cacheStats = cache.getStats();
    const dataStats = dataGenerator.getStatistics();

    res.json({
      success: true,
      data: {
        status: 'healthy',
        timestamp: new Date().toISOString(),
        uptime: process.uptime(),
        memory: process.memoryUsage(),
        dataGenerator: dataStats,
        cache: cacheStats,
      },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: {
        code: 'HEALTH_CHECK_FAILED',
        message: 'Health check failed',
      },
    });
  }
});

export { router as healthRoutes };
