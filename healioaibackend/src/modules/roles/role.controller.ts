import { Request, Response, NextFunction } from 'express';
import { AuthenticatedRequest } from '../../common/middlewares/auth.middleware';
import { RoleService } from './role.service';
import {
  createRoleSchema,
  updateRoleSchema,
  roleIdParamSchema,
  listRolesQuerySchema,
} from './role.validation';
import { validateBody, validateParams, validateQuery } from '../../common/validation/validate';
import { HTTP_STATUS } from '../../common/constants';

const roleService = new RoleService();

export async function createRole(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const authReq = req as AuthenticatedRequest;
    const role = await roleService.create(req.body, authReq.userId);
    res.status(HTTP_STATUS.CREATED).json({ success: true, data: role });
  } catch (err) {
    next(err);
  }
}

export async function getRoleById(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const role = await roleService.getById(req.params.id);
    res.status(HTTP_STATUS.OK).json({ success: true, data: role });
  } catch (err) {
    next(err);
  }
}

export async function listRoles(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const page = Number(req.query.page) || 1;
    const limit = Number(req.query.limit) || 20;
    const result = await roleService.list(page, limit);
    res.status(HTTP_STATUS.OK).json({ success: true, ...result });
  } catch (err) {
    next(err);
  }
}

export async function updateRole(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const authReq = req as AuthenticatedRequest;
    const role = await roleService.update(req.params.id, req.body, authReq.userId);
    res.status(HTTP_STATUS.OK).json({ success: true, data: role });
  } catch (err) {
    next(err);
  }
}

export async function deleteRole(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    await roleService.delete(req.params.id);
    res.status(HTTP_STATUS.NO_CONTENT).send();
  } catch (err) {
    next(err);
  }
}

export const createRoleValidation = [validateBody(createRoleSchema)];
export const getRoleByIdValidation = [validateParams(roleIdParamSchema)];
export const listRolesValidation = [validateQuery(listRolesQuerySchema)];
export const updateRoleValidation = [
  validateParams(roleIdParamSchema),
  validateBody(updateRoleSchema),
];
export const deleteRoleValidation = [validateParams(roleIdParamSchema)];
