import express, { Express } from 'express';
import { corsMiddleware } from './middlewares/cors';
import { errorHandler } from './middlewares/errorHandler';
import { requestLogger } from './middlewares/requestLogger';
import { analyticsRoutes } from './routes/analytics.routes';
import { healthRoutes } from './routes/health.routes';

/**
 * Create and configure Express server
 */
export function createServer(): Express {
  const app = express();

  // Body parsing middleware
  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));

  // CORS middleware
  app.use(corsMiddleware);

  // Request logging
  app.use(requestLogger);

  // Health check routes
  app.use('/health', healthRoutes);

  // API routes
  app.use('/api', analyticsRoutes);

  // 404 handler
  app.use('*', (req, res) => {
    res.status(404).json({
      success: false,
      error: {
        code: 'NOT_FOUND',
        message: `Route ${req.method} ${req.originalUrl} not found`,
      },
    });
  });

  // Global error handler (must be last)
  app.use(errorHandler);

  return app;
}
