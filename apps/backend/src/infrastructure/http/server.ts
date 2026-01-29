import express, { Application } from 'express';
import cors from 'cors';
import { config } from '../../shared/constants/config';

export function createServer(): Application {
  const app = express();

  // Middleware
  app.use(express.json());
  app.use(
    cors({
      origin: config.allowedOrigins,
      credentials: true,
    })
  );

  // Health check endpoint
  app.get('/health', (_req, res) => {
    res.json({
      status: 'healthy',
      timestamp: new Date().toISOString(),
      environment: config.nodeEnv,
    });
  });

  // API routes placeholder
  app.get('/api', (_req, res) => {
    res.json({
      message: 'Analytics Dashboard API',
      version: '1.0.0',
    });
  });

  // Error handling middleware
  app.use(
    (err: Error, _req: express.Request, res: express.Response, _next: express.NextFunction) => {
      console.error('Error:', err.message);
      res.status(500).json({
        success: false,
        error: {
          code: 'INTERNAL_SERVER_ERROR',
          message: config.nodeEnv === 'development' ? err.message : 'Internal server error',
        },
      });
    }
  );

  return app;
}
