import { Request, Response, NextFunction } from 'express';
import * as admin from 'firebase-admin';
import { AppError } from '../errors/app-error';
import { ErrorCode } from '../errors/error-codes';
import { HTTP_STATUS } from '../constants';
import { UserModel } from '../../modules/users/user.model';
import { ClinicModel } from '../../modules/clinics/clinic.model';
import { LabModel } from '../../modules/labs/Lab.model';
import { AdminModel } from '../../modules/admins/admin.model';

export interface AuthenticatedRequest extends Request {
  userId?: string;
  firebaseUid?: string;
  userType?: 'user' | 'clinic' | 'lab' | 'admin';
}

export async function authMiddleware(
  req: AuthenticatedRequest,
  _res: Response,
  next: NextFunction
): Promise<void> {
  const authHeader = req.headers.authorization;

  if (!authHeader?.startsWith('Bearer ')) {
    next(new AppError(
      ErrorCode.UNAUTHORIZED,
      HTTP_STATUS.UNAUTHORIZED,
      'Missing or invalid authorization header'
    ));
    return;
  }

  const token = authHeader.slice(7);

  try {
    const decodedToken = await admin.auth().verifyIdToken(token);
    const firebaseUid = decodedToken.uid;
    req.firebaseUid = firebaseUid;

    // Check Admins
    const adminUser = await AdminModel.findOne({ firebaseUid });
    if (adminUser) {
      req.userId = adminUser._id.toString();
      req.userType = 'admin';
      next();
      return;
    }

    // Check Users
    const user = await UserModel.findOne({ firebaseUid });
    if (user) {
      req.userId = user._id.toString();
      req.userType = 'user';
      next();
      return;
    }

    // Check Clinics
    const clinic = await ClinicModel.findOne({ firebaseUid });
    if (clinic) {
      req.userId = clinic._id.toString();
      req.userType = 'clinic';
      next();
      return;
    }

    // Check Labs
    const lab = await LabModel.findOne({ firebaseUid });
    if (lab) {
      req.userId = lab._id.toString();
      req.userType = 'lab';
      next();
      return;
    }

    // If not found in any collection, it might be a new user (signup scenario)
    // However, for protected routes that require userId, this is an error.
    // We can handle this by checking if the route is a signup route, 
    // but typically signup routes don't use this middleware or allow optional auth.
    // For now, we'll assume strict auth.
    
    // Exception: If the user is just signing up, they might have a valid token but no DB record.
    // But this middleware is for "Authenticated Request" which implies a registered user.
    // If you need "Token Only" auth (for signup), we might need a separate middleware.
    // For now, throwing User Not Found is safer.
    
    next(new AppError(
        ErrorCode.NOT_FOUND,
        HTTP_STATUS.UNAUTHORIZED,
        'User profile not found'
    ));

  } catch (error) {
    next(new AppError(
      ErrorCode.UNAUTHORIZED,
      HTTP_STATUS.UNAUTHORIZED,
      'Invalid or expired token'
    ));
  }
}

export async function verifyFirebaseTokenMiddleware(
  req: AuthenticatedRequest,
  _res: Response,
  next: NextFunction
): Promise<void> {
  const authHeader = req.headers.authorization;

  if (!authHeader?.startsWith('Bearer ')) {
    next(new AppError(
      ErrorCode.UNAUTHORIZED,
      HTTP_STATUS.UNAUTHORIZED,
      'Missing or invalid authorization header'
    ));
    return;
  }

  const token = authHeader.slice(7);

  try {
    const decodedToken = await admin.auth().verifyIdToken(token);
    req.firebaseUid = decodedToken.uid;
    next();
  } catch (error) {
    next(new AppError(
      ErrorCode.UNAUTHORIZED,
      HTTP_STATUS.UNAUTHORIZED,
      'Invalid or expired token'
    ));
  }
}

export async function optionalAuthMiddleware(
  req: AuthenticatedRequest,
  _res: Response,
  next: NextFunction
): Promise<void> {
  const authHeader = req.headers.authorization;
  if (authHeader?.startsWith('Bearer ')) {
    const token = authHeader.slice(7);
    try {
        const decodedToken = await admin.auth().verifyIdToken(token);
        const firebaseUid = decodedToken.uid;
        req.firebaseUid = firebaseUid;
    
        const user = await UserModel.findOne({ firebaseUid });
        if (user) {
          req.userId = user._id.toString();
          req.userType = 'user';
        } else {
            const clinic = await ClinicModel.findOne({ firebaseUid });
            if (clinic) {
              req.userId = clinic._id.toString();
              req.userType = 'clinic';
            } else {
                const lab = await LabModel.findOne({ firebaseUid });
                if (lab) {
                  req.userId = lab._id.toString();
                  req.userType = 'lab';
                }
            }
        }
    } catch (error) {
        // Ignore error for optional auth
    }
  }
  next();
}
