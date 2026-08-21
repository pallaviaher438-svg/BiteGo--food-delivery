import { Request, Response, NextFunction } from 'express';
import { verifyToken } from '../utils/authUtils';
import { AppError } from '../utils/AppError';
import { AuthenticatedRequest, UserRole } from '../types';

/**
 * JWT Bearer token authentication middleware.
 * Extracts and verifies token from Authorization header.
 * Attaches decoded user payload to req.user.
 */
export function authenticate(req: AuthenticatedRequest, _res: Response, next: NextFunction): void {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      throw AppError.unauthorized('Missing or invalid authorization header');
    }

    const token = authHeader.split(' ')[1];
    if (!token) {
      throw AppError.unauthorized('Token not provided');
    }

    const payload = verifyToken(token);
    req.user = {
      id: payload.id,
      role: payload.role as UserRole,
      email: payload.email,
      phone: payload.phone,
      restaurantId: payload.restaurantId,
    };

    next();
  } catch (err: any) {
    if (err instanceof AppError) {
      next(err);
    } else {
      next(AppError.unauthorized(err.message || 'Invalid or expired token'));
    }
  }
}

/**
 * Optional authentication — doesn't fail if no token present,
 * but attaches user if token is valid.
 */
export function optionalAuth(req: AuthenticatedRequest, _res: Response, next: NextFunction): void {
  try {
    const authHeader = req.headers.authorization;
    if (authHeader && authHeader.startsWith('Bearer ')) {
      const token = authHeader.split(' ')[1];
      if (token) {
        const payload = verifyToken(token);
        req.user = {
          id: payload.id,
          role: payload.role as UserRole,
          email: payload.email,
          phone: payload.phone,
          restaurantId: payload.restaurantId,
        };
      }
    }
  } catch {
    // Silently continue without user context
  }
  next();
}

/**
 * Role-based authorization middleware.
 * Must be used after authenticate.
 */
export function authorizeRoles(...roles: UserRole[]) {
  return (req: AuthenticatedRequest, _res: Response, next: NextFunction): void => {
    if (!req.user) {
      return next(AppError.unauthorized());
    }
    if (!roles.includes(req.user.role)) {
      return next(AppError.forbidden(`Role '${req.user.role}' is not authorized for this action`));
    }
    next();
  };
}
