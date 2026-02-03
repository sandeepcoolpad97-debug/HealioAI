import { Request, Response, NextFunction } from 'express';
import { AuthenticatedRequest } from '../../common/middlewares/auth.middleware';
import { AdminService } from './admin.service';
import {
  onboardAdminSchema,
  createAdminSchema,
  updateAdminSchema,
  getAdminByIdSchema,
  listAdminsSchema,
  deleteAdminSchema,
  loginAdminSchema,
} from './admin.validation';
import { validateBody, validateParams, validateQuery } from '../../common/validation/validate';
import { HTTP_STATUS } from '../../common/constants';

const adminService = new AdminService();

export async function loginAdmin(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const admin = await adminService.login(req.body);
    res.status(HTTP_STATUS.OK).json({ success: true, data: admin });
  } catch (err) {
    next(err);
  }
}

export async function onboardAdmin(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const authReq = req as AuthenticatedRequest;
    const admin = await adminService.onboard(req.body, authReq.userId);
    res.status(HTTP_STATUS.CREATED).json({ success: true, data: admin });
  } catch (err) {
    next(err);
  }
}

export async function createAdmin(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const authReq = req as AuthenticatedRequest;
    const admin = await adminService.create(req.body, authReq.userId);
    res.status(HTTP_STATUS.CREATED).json({ success: true, data: admin });
  } catch (err) {
    next(err);
  }
}

export async function getAdminById(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const admin = await adminService.getById(req.params.id);
    res.status(HTTP_STATUS.OK).json({ success: true, data: admin });
  } catch (err) {
    next(err);
  }
}

export async function listAdmins(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const page = Number(req.query.page) || 1;
    const limit = Number(req.query.limit) || 20;
    const result = await adminService.list(page, limit);
    res.status(HTTP_STATUS.OK).json({ success: true, ...result });
  } catch (err) {
    next(err);
  }
}

export async function updateAdmin(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const authReq = req as AuthenticatedRequest;
    const admin = await adminService.update(req.params.id, req.body, authReq.userId);
    res.status(HTTP_STATUS.OK).json({ success: true, data: admin });
  } catch (err) {
    next(err);
  }
}

export async function deleteAdmin(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    await adminService.delete(req.params.id);
    res.status(HTTP_STATUS.NO_CONTENT).send();
  } catch (err) {
    next(err);
  }
}

export const onboardAdminValidation = [validateBody(onboardAdminSchema)];
export const loginAdminValidation = [validateBody(loginAdminSchema)];
export const createAdminValidation = [validateBody(createAdminSchema)];
export const getAdminByIdValidation = [validateParams(getAdminByIdSchema)];
export const listAdminsValidation = [validateQuery(listAdminsSchema)];
export const updateAdminValidation = [validateParams(getAdminByIdSchema), validateBody(updateAdminSchema)];
export const deleteAdminValidation = [validateParams(deleteAdminSchema)];
