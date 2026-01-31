import { Request, Response, NextFunction } from 'express';

/**
 * Request logging middleware
 */
export function requestLogger(req: Request, res: Response, next: NextFunction) {
  const startTime = Date.now();

  // Log request
  console.log(`→ ${req.method} ${req.path}`, {
    query: req.query,
    ip: req.ip,
  });

  // Log response when finished
  res.on('finish', () => {
    const duration = Date.now() - startTime;
    console.log(`← ${req.method} ${req.path} ${res.statusCode} (${duration}ms)`);
  });

  next();
}
