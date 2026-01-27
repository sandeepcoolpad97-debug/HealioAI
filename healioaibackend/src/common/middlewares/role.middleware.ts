import { Response, NextFunction } from 'express';
import { AppError } from '../errors/app-error';
import { ErrorCode } from '../errors/error-codes';
import { HTTP_STATUS } from '../constants';
import { AuthenticatedRequest } from './auth.middleware';

export type AllowedRole = string;

export function roleMiddleware(...allowedRoles: AllowedRole[]) {
  return (req: AuthenticatedRequest, _res: Response, next: NextFunction): void => {
    const userId = req.userId;
    if (!userId) {
      throw new AppError(
        ErrorCode.UNAUTHORIZED,
        HTTP_STATUS.UNAUTHORIZED,
        'Authentication required'
      );
    }

    // Template: no role on request yet; in production, resolve user.role and check
    // if (allowedRoles.length && !allowedRoles.includes(userRole)) { throw new AppError(...) }
    next();
  };
}
