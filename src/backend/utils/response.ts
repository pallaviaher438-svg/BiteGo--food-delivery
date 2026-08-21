import { Response } from 'express';

export function sendSuccess(res: Response, data: any = null, message: string = 'Success', statusCode: number = 200) {
  return res.status(statusCode).json({
    success: true,
    message,
    data,
  });
}

export function sendCreated(res: Response, data: any, message: string = 'Created successfully') {
  return sendSuccess(res, data, message, 201);
}

export function sendNoContent(res: Response) {
  return res.status(204).send();
}

export function sendError(res: Response, statusCode: number, message: string, code: string, errors?: any[]) {
  return res.status(statusCode).json({
    success: false,
    message,
    code,
    errors: errors || [],
  });
}
