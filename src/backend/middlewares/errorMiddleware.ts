import { Request, Response, NextFunction } from 'express';
import { AppError } from '../utils/AppError';
import { logger } from '../config/logger';
import { env } from '../config/env';

/**
 * Centralized Express error handler.
 * Catches all errors thrown in routes/middleware and returns standardized JSON.
 */
export function errorHandler(err: any, req: Request, res: Response, _next: NextFunction): void {
  // Default values
  let statusCode = err.statusCode || 500;
  let code = err.code || 'INTERNAL_SERVER_ERROR';
  let message = err.message || 'An unexpected error occurred';
  let errors = err.errors || [];

  // Log the error
  if (statusCode >= 500) {
    logger.error(`[${code}] ${message}`, {
      url: req.originalUrl,
      method: req.method,
      stack: env.isDev ? err.stack : undefined,
    });
  } else {
    logger.warn(`[${code}] ${message}`, {
      url: req.originalUrl,
      method: req.method,
    });
  }

  // Suppress internal details in production
  if (env.isProd && statusCode >= 500) {
    message = 'An unexpected error occurred';
    errors = [];
  }

  res.status(statusCode).json({
    success: false,
    message,
    code,
    errors,
  });
}

/**
 * 404 handler for unmatched routes.
 */
export function notFoundHandler(req: Request, _res: Response, next: NextFunction): void {
  next(AppError.notFound(`Route ${req.method} ${req.originalUrl}`));
}
