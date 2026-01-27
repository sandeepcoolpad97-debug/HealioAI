import { Request, Response, NextFunction } from 'express';
import { AppError } from '../errors/app-error';
import { ErrorCode } from '../errors/error-codes';
import { HTTP_STATUS } from '../constants';

export interface AuthenticatedRequest extends Request {
  userId?: string;
}

export function authMiddleware(
  req: AuthenticatedRequest,
  _res: Response,
  next: NextFunction
): void {
  const authHeader = req.headers.authorization;

  if (!authHeader?.startsWith('Bearer ')) {
    throw new AppError(
      ErrorCode.UNAUTHORIZED,
      HTTP_STATUS.UNAUTHORIZED,
      'Missing or invalid authorization header'
    );
  }

  const token = authHeader.slice(7);
  // Placeholder: replace with real JWT decode/verify in production
  if (!token) {
    throw new AppError(
      ErrorCode.UNAUTHORIZED,
      HTTP_STATUS.UNAUTHORIZED,
      'Invalid token'
    );
  }

  // For template: accept any non-empty token as valid; wire real auth later
  req.userId = token;
  next();
}

export function optionalAuthMiddleware(
  req: AuthenticatedRequest,
  _res: Response,
  next: NextFunction
): void {
  const authHeader = req.headers.authorization;
  if (authHeader?.startsWith('Bearer ')) {
    req.userId = authHeader.slice(7);
  }
  next();
}
