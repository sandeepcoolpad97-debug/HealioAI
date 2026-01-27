import { Request, Response, NextFunction } from 'express';
import { AppError } from './app-error';
import { ErrorCode } from './error-codes';
import { logger } from '../logger/logger';
import { HTTP_STATUS } from '../constants';

export function errorHandler(
  err: Error,
  _req: Request,
  res: Response,
  _next: NextFunction
): void {
  if (err instanceof AppError) {
    res.status(err.statusCode).json({
      success: false,
      code: err.code,
      message: err.message,
      ...(err.details && { details: err.details }),
    });
    return;
  }

  if (err.name === 'ValidationError') {
    res.status(HTTP_STATUS.BAD_REQUEST).json({
      success: false,
      code: ErrorCode.VALIDATION_ERROR,
      message: err.message,
    });
    return;
  }

  logger.error('Unhandled error', { err });
  res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).json({
    success: false,
    code: ErrorCode.INTERNAL_ERROR,
    message: 'Internal server error',
  });
}
