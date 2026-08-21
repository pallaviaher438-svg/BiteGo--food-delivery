export class AppError extends Error {
  public readonly statusCode: number;
  public readonly code: string;
  public readonly isOperational: boolean;
  public readonly errors?: any[];

  constructor(
    message: string,
    statusCode: number = 500,
    code: string = 'INTERNAL_SERVER_ERROR',
    errors?: any[]
  ) {
    super(message);
    this.statusCode = statusCode;
    this.code = code;
    this.isOperational = true;
    this.errors = errors;
    Object.setPrototypeOf(this, AppError.prototype);
    Error.captureStackTrace(this, this.constructor);
  }

  static badRequest(message: string, errors?: any[]) {
    return new AppError(message, 400, 'BAD_REQUEST', errors);
  }

  static validationError(message: string, errors?: any[]) {
    return new AppError(message, 400, 'VALIDATION_ERROR', errors);
  }

  static unauthorized(message: string = 'Authentication required') {
    return new AppError(message, 401, 'UNAUTHORIZED');
  }

  static forbidden(message: string = 'Access denied') {
    return new AppError(message, 403, 'FORBIDDEN');
  }

  static notFound(resource: string = 'Resource') {
    return new AppError(`${resource} not found`, 404, 'RESOURCE_NOT_FOUND');
  }

  static conflict(message: string) {
    return new AppError(message, 409, 'CONFLICT');
  }

  static tooManyRequests(message: string = 'Too many requests') {
    return new AppError(message, 429, 'TOO_MANY_REQUESTS');
  }

  static invalidStatusTransition(from: string, to: string) {
    return new AppError(
      `Invalid status transition from '${from}' to '${to}'`,
      400,
      'INVALID_STATUS_TRANSITION'
    );
  }

  static invalidOtp(message: string = 'Invalid OTP') {
    return new AppError(message, 400, 'INVALID_OTP');
  }

  static invalidCoupon(message: string) {
    return new AppError(message, 400, 'INVALID_COUPON');
  }
}
