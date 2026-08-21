import { Request, Response, NextFunction } from 'express';
import { AppError } from '../utils/AppError';

interface ValidationSchema {
  [field: string]: {
    required?: boolean;
    type?: 'string' | 'number' | 'boolean' | 'array' | 'object';
    minLength?: number;
    maxLength?: number;
    min?: number;
    max?: number;
    enum?: any[];
    pattern?: RegExp;
    message?: string;
  };
}

/**
 * Generic request body validator middleware factory.
 */
export function validateBody(schema: ValidationSchema) {
  return (req: Request, _res: Response, next: NextFunction): void => {
    const errors: any[] = [];
    const body = req.body || {};

    for (const [field, rules] of Object.entries(schema)) {
      const value = body[field];

      if (rules.required && (value === undefined || value === null || value === '')) {
        errors.push({ field, message: rules.message || `${field} is required` });
        continue;
      }

      if (value === undefined || value === null) continue;

      if (rules.type) {
        if (rules.type === 'array' && !Array.isArray(value)) {
          errors.push({ field, message: `${field} must be an array` });
          continue;
        }
        if (rules.type !== 'array' && typeof value !== rules.type) {
          errors.push({ field, message: `${field} must be of type ${rules.type}` });
          continue;
        }
      }

      if (typeof value === 'string') {
        if (rules.minLength && value.length < rules.minLength) {
          errors.push({ field, message: `${field} must be at least ${rules.minLength} characters` });
        }
        if (rules.maxLength && value.length > rules.maxLength) {
          errors.push({ field, message: `${field} must be at most ${rules.maxLength} characters` });
        }
        if (rules.pattern && !rules.pattern.test(value)) {
          errors.push({ field, message: rules.message || `${field} format is invalid` });
        }
      }

      if (typeof value === 'number') {
        if (rules.min !== undefined && value < rules.min) {
          errors.push({ field, message: `${field} must be at least ${rules.min}` });
        }
        if (rules.max !== undefined && value > rules.max) {
          errors.push({ field, message: `${field} must be at most ${rules.max}` });
        }
      }

      if (rules.enum && !rules.enum.includes(value)) {
        errors.push({ field, message: `${field} must be one of: ${rules.enum.join(', ')}` });
      }
    }

    if (errors.length > 0) {
      return next(AppError.validationError('Validation failed', errors));
    }

    next();
  };
}
