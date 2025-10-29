import { Request, Response, NextFunction } from 'express';
import { ZodError } from 'zod';

import { sendError } from '../utils/response';

export class AppError extends Error {
  constructor(
    public message: string,
    public statusCode: number = 500
  ) {
    super(message);
    this.name = 'AppError';
  }
}

export const errorHandler = (
  error: Error | AppError | ZodError,
  req: Request,
  res: Response,
  _next: NextFunction
) => {
  if (error instanceof ZodError) {
    return sendError(res, 'Validation error', 400, error.errors);
  }

  if (error instanceof AppError) {
    return sendError(res, error.message, error.statusCode);
  }

  console.error('Unhandled error:', error);
  return sendError(res, 'Internal server error', 500);
};

export const asyncHandler = (
  fn: (req: Request, res: Response, next: NextFunction) => Promise<unknown>
) => {
  return (req: Request, res: Response, next: NextFunction) => {
    Promise.resolve(fn(req, res, next)).catch(next);
  };
};
