import { Request, Response, NextFunction } from 'express';
import { AuthenticatedRequest } from '../../common/middlewares/auth.middleware';
import { ClinicService } from './clinic.service';
import {
  createClinicSchema,
  updateClinicSchema,
  clinicIdParamSchema,
  listClinicsQuerySchema,
} from './clinic.validation';
import { validateBody, validateParams, validateQuery } from '../../common/validation/validate';
import { HTTP_STATUS } from '../../common/constants';

const clinicService = new ClinicService();

export async function createClinic(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const clinic = await clinicService.create(req.body);
    res.status(HTTP_STATUS.CREATED).json({ success: true, data: clinic });
  } catch (err) {
    next(err);
  }
}

export async function getClinicById(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const clinic = await clinicService.getById(req.params.id);
    res.status(HTTP_STATUS.OK).json({ success: true, data: clinic });
  } catch (err) {
    next(err);
  }
}

export async function listClinics(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const page = Number(req.query.page) || 1;
    const limit = Number(req.query.limit) || 20;
    const result = await clinicService.list(page, limit);
    res.status(HTTP_STATUS.OK).json({ success: true, ...result });
  } catch (err) {
    next(err);
  }
}

export async function updateClinic(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const authReq = req as AuthenticatedRequest;
    const clinic = await clinicService.update(req.params.id, req.body, authReq.userId);
    res.status(HTTP_STATUS.OK).json({ success: true, data: clinic });
  } catch (err) {
    next(err);
  }
}

export async function deleteClinic(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    await clinicService.delete(req.params.id);
    res.status(HTTP_STATUS.NO_CONTENT).send();
  } catch (err) {
    next(err);
  }
}

export const createClinicValidation = [validateBody(createClinicSchema)];
export const getClinicByIdValidation = [validateParams(clinicIdParamSchema)];
export const listClinicsValidation = [validateQuery(listClinicsQuerySchema)];
export const updateClinicValidation = [
  validateParams(clinicIdParamSchema),
  validateBody(updateClinicSchema),
];
export const deleteClinicValidation = [validateParams(clinicIdParamSchema)];
