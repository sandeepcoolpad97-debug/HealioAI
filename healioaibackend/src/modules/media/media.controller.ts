import { Request, Response, NextFunction } from 'express';
import { AuthenticatedRequest } from '../../common/middlewares/auth.middleware';
import { MediaService } from './media.service';
import { createMediaSchema, mediaIdParamSchema, updateMediaSchema } from './media.validation';
import { validateBody, validateParams } from '../../common/validation/validate';
import { HTTP_STATUS } from '../../common/constants';

const mediaService = new MediaService();

export async function createMedia(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const authReq = req as AuthenticatedRequest;
    const media = await mediaService.create(req.body, authReq.userId);
    res.status(HTTP_STATUS.CREATED).json({ success: true, data: media });
  } catch (err) {
    next(err);
  }
}

export async function getMediaById(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const media = await mediaService.getById(req.params.id);
    res.status(HTTP_STATUS.OK).json({ success: true, data: media });
  } catch (err) {
    next(err);
  }
}

export async function updateMedia(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const authReq = req as AuthenticatedRequest;
    const media = await mediaService.update(req.params.id, req.body, authReq.userId);
    res.status(HTTP_STATUS.OK).json({ success: true, data: media });
  } catch (err) {
    next(err);
  }
}

export async function deleteMedia(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    await mediaService.delete(req.params.id);
    res.status(HTTP_STATUS.NO_CONTENT).send();
  } catch (err) {
    next(err);
  }
}

export const createMediaValidation = [validateBody(createMediaSchema)];
export const getMediaByIdValidation = [validateParams(mediaIdParamSchema)];
export const updateMediaValidation = [
  validateParams(mediaIdParamSchema),
  validateBody(updateMediaSchema),
];
export const deleteMediaValidation = [validateParams(mediaIdParamSchema)];

