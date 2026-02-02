import { Request, Response, NextFunction } from 'express';
import { AuthenticatedRequest } from '../../common/middlewares/auth.middleware';
import { LabService } from './lab.service';
import {
  loginLabSchema,
  createLabSchema,
  updateLabSchema,
  labIdParamSchema,
  listLabsQuerySchema,
} from './lab.validation';
import { validateBody, validateParams, validateQuery } from '../../common/validation/validate';
import { HTTP_STATUS } from '../../common/constants';

const labService = new LabService();

export async function loginLab(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const lab = await labService.login(req.body);
    res.status(HTTP_STATUS.OK).json({ success: true, data: lab });
  } catch (err) {
    next(err);
  }
}

export async function createLab(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const authReq = req as AuthenticatedRequest;
    const lab = await labService.create(req.body, authReq.userId);
    res.status(HTTP_STATUS.CREATED).json({ success: true, data: lab });
  } catch (err) {
    next(err);
  }
}

export async function getLabById(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const lab = await labService.getById(req.params.id);
    res.status(HTTP_STATUS.OK).json({ success: true, data: lab });
  } catch (err) {
    next(err);
  }
}

export async function listLabs(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const page = Number(req.query.page) || 1;
    const limit = Number(req.query.limit) || 20;
    const result = await labService.list(page, limit);
    res.status(HTTP_STATUS.OK).json({ success: true, ...result });
  } catch (err) {
    next(err);
  }
}

export async function updateLab(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const authReq = req as AuthenticatedRequest;
    const lab = await labService.update(req.params.id, req.body, authReq.userId);
    res.status(HTTP_STATUS.OK).json({ success: true, data: lab });
  } catch (err) {
    next(err);
  }
}

export async function deleteLab(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    await labService.delete(req.params.id);
    res.status(HTTP_STATUS.NO_CONTENT).send();
  } catch (err) {
    next(err);
  }
}

export const loginLabValidation = [validateBody(loginLabSchema)];
export const createLabValidation = [validateBody(createLabSchema)];
export const getLabByIdValidation = [validateParams(labIdParamSchema)];
export const listLabsValidation = [validateQuery(listLabsQuerySchema)];
export const updateLabValidation = [
  validateParams(labIdParamSchema),
  validateBody(updateLabSchema),
];
export const deleteLabValidation = [validateParams(labIdParamSchema)];
