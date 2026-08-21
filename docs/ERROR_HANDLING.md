# Centralized Error Handling Specification

## Standard Error Response Format
All errors returned by any endpoint across the API adhere to this single standardized structure:

```json
{
  "success": false,
  "message": "User-friendly description of the error",
  "code": "SPECIFIC_ERROR_CODE",
  "errors": [
    {
      "field": "phone",
      "message": "Please enter a valid 10-digit Indian phone number"
    }
  ]
}
```

## Standard Error Codes

| HTTP Status | Error Code | Description |
|---|---|---|
| **400** | `BAD_REQUEST` | Malformed request or missing mandatory payload |
| **400** | `VALIDATION_ERROR` | Schema validation failure on body or query params |
| **400** | `INVALID_COUPON` | Coupon code does not exist or min order not reached |
| **400** | `INVALID_STATUS_TRANSITION` | Attempting illegal order status change |
| **400** | `INVALID_OTP` | Invalid customer delivery OTP or login OTP |
| **401** | `UNAUTHORIZED` | Missing, invalid, or expired JWT bearer token |
| **403** | `FORBIDDEN` | Authenticated user lacks role permissions |
| **404** | `RESOURCE_NOT_FOUND` | Restaurant, order, menu item, or address not found |
| **409** | `CONFLICT` | Entity with same email/phone/code already exists |
| **429** | `TOO_MANY_REQUESTS` | Rate limit threshold exceeded |
| **500** | `INTERNAL_SERVER_ERROR` | Unhandled server error (stack trace logged internally only) |

## Custom `AppError` Class
All application logic throws derived instances of `AppError`:

```typescript
export class AppError extends Error {
  public readonly statusCode: number;
  public readonly code: string;
  public readonly isOperational: boolean;
  public readonly errors?: any[];

  constructor(message: string, statusCode = 500, code = 'INTERNAL_SERVER_ERROR', errors?: any[]) {
    super(message);
    this.statusCode = statusCode;
    this.code = code;
    this.errors = errors;
    this.isOperational = true;
    Error.captureStackTrace(this, this.constructor);
  }
}
```

## Centralized Express Middleware
An Express error handling middleware `(err, req, res, next)` intercepts all errors, maps them to status codes, logs operational warnings or critical errors via `logger.ts`, and produces the clean JSON error payload.
