import { Request, Response, NextFunction } from 'express';
import { env } from '../config/env';
import { logger } from '../config/logger';

/**
 * Simple in-memory rate limiter (no external dependency).
 */
const requestCounts = new Map<string, { count: number; resetTime: number }>();

export function rateLimiter(windowMs?: number, maxRequests?: number) {
  const window = windowMs || env.RATE_LIMIT_WINDOW_MS;
  const max = maxRequests || env.RATE_LIMIT_MAX;

  return (req: Request, res: Response, next: NextFunction): void => {
    const key = req.ip || req.socket.remoteAddress || 'unknown';
    const now = Date.now();

    const entry = requestCounts.get(key);
    if (!entry || now > entry.resetTime) {
      requestCounts.set(key, { count: 1, resetTime: now + window });
      return next();
    }

    if (entry.count >= max) {
      res.status(429).json({
        success: false,
        message: 'Too many requests, please try again later',
        code: 'TOO_MANY_REQUESTS',
        errors: [],
      });
      return;
    }

    entry.count++;
    next();
  };
}

/**
 * CORS middleware (manual, no external cors package dependency).
 */
export function corsMiddleware(req: Request, res: Response, next: NextFunction): void {
  const origin = env.CORS_ORIGIN;
  res.header('Access-Control-Allow-Origin', origin);
  res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, PATCH, DELETE, OPTIONS');
  res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization, X-Requested-With');
  res.header('Access-Control-Allow-Credentials', 'true');
  res.header('Access-Control-Max-Age', '86400');

  if (req.method === 'OPTIONS') {
    res.status(204).send();
    return;
  }
  next();
}

/**
 * Security headers (Helmet-like, no dependency).
 */
export function securityHeaders(_req: Request, res: Response, next: NextFunction): void {
  res.header('X-Content-Type-Options', 'nosniff');
  res.header('X-Frame-Options', 'SAMEORIGIN');
  res.header('X-XSS-Protection', '1; mode=block');
  res.header('Referrer-Policy', 'strict-origin-when-cross-origin');
  res.header('X-Permitted-Cross-Domain-Policies', 'none');
  next();
}

/**
 * Request logging middleware.
 */
export function requestLogger(req: Request, res: Response, next: NextFunction): void {
  const start = Date.now();
  res.on('finish', () => {
    const duration = Date.now() - start;
    logger.request(req.method, req.originalUrl, res.statusCode, duration);
  });
  next();
}
