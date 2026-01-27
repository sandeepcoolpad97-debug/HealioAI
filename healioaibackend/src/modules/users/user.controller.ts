import { Request, Response, NextFunction } from 'express';
import { UserService } from './user.service';
import {
  createUserSchema,
  updateUserSchema,
  userIdParamSchema,
  listUsersQuerySchema,
} from './user.validation';
import { validateBody, validateParams, validateQuery } from '../../common/validation/validate';
import { HTTP_STATUS } from '../../common/constants';

const userService = new UserService();

export async function createUser(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const user = await userService.create(req.body);
    res.status(HTTP_STATUS.CREATED).json({ success: true, data: user });
  } catch (err) {
    next(err);
  }
}

export async function getUserById(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const user = await userService.getById(req.params.id);
    res.status(HTTP_STATUS.OK).json({ success: true, data: user });
  } catch (err) {
    next(err);
  }
}

export async function listUsers(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const page = Number(req.query.page) || 1;
    const limit = Number(req.query.limit) || 20;
    const result = await userService.list(page, limit);
    res.status(HTTP_STATUS.OK).json({ success: true, ...result });
  } catch (err) {
    next(err);
  }
}

export async function updateUser(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const user = await userService.update(req.params.id, req.body);
    res.status(HTTP_STATUS.OK).json({ success: true, data: user });
  } catch (err) {
    next(err);
  }
}

export async function deleteUser(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    await userService.delete(req.params.id);
    res.status(HTTP_STATUS.NO_CONTENT).send();
  } catch (err) {
    next(err);
  }
}

export const createUserValidation = [validateBody(createUserSchema)];
export const getUserByIdValidation = [validateParams(userIdParamSchema)];
export const listUsersValidation = [validateQuery(listUsersQuerySchema)];
export const updateUserValidation = [
  validateParams(userIdParamSchema),
  validateBody(updateUserSchema),
];
export const deleteUserValidation = [validateParams(userIdParamSchema)];
