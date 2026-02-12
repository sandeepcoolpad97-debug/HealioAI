import { Request, Response, NextFunction } from 'express';
import { NotificationTypeService } from './notificationType.service';
import {
    createNotificationTypeSchema,
    updateNotificationTypeSchema,
    notificationTypeIdParamSchema,
    listNotificationTypesQuerySchema,
} from './notificationType.validation';
import { validateBody, validateParams, validateQuery } from '../../common/validation/validate';
import { HTTP_STATUS } from '../../common/constants';
import { AuthenticatedRequest } from '../../common/middlewares/auth.middleware';

const notificationTypeService = new NotificationTypeService();

export async function createNotificationType(
    req: Request,
    res: Response,
    next: NextFunction
): Promise<void> {
    try {
        const authReq = req as AuthenticatedRequest;
        const notificationType = await notificationTypeService.create(req.body, authReq.userId);
        res.status(HTTP_STATUS.CREATED).json({ success: true, data: notificationType });
    } catch (err) {
        next(err);
    }
}

export async function getNotificationTypeById(
    req: Request,
    res: Response,
    next: NextFunction
): Promise<void> {
    try {
        const notificationType = await notificationTypeService.getById(req.params.id);
        res.status(HTTP_STATUS.OK).json({ success: true, data: notificationType });
    } catch (err) {
        next(err);
    }
}

export async function getNotificationTypeByKey(
    req: Request,
    res: Response,
    next: NextFunction
): Promise<void> {
    try {
        const notificationType = await notificationTypeService.getByKey(req.params.key);
        res.status(HTTP_STATUS.OK).json({ success: true, data: notificationType });
    } catch (err) {
        next(err);
    }
}

export async function listNotificationTypes(
    req: Request,
    res: Response,
    next: NextFunction
): Promise<void> {
    try {
        const page = Number(req.query.page) || 1;
        const limit = Number(req.query.limit) || 20;
        const search = req.query.search as string;
        const priority = req.query.priority ? Number(req.query.priority) : undefined;

        const result = await notificationTypeService.list(page, limit, { search, priority });
        res.status(HTTP_STATUS.OK).json({ success: true, ...result });
    } catch (err) {
        next(err);
    }
}

export async function updateNotificationType(
    req: Request,
    res: Response,
    next: NextFunction
): Promise<void> {
    try {
        const authReq = req as AuthenticatedRequest;
        const notificationType = await notificationTypeService.update(
            req.params.id,
            req.body,
            authReq.userId
        );
        res.status(HTTP_STATUS.OK).json({ success: true, data: notificationType });
    } catch (err) {
        next(err);
    }
}

export async function deleteNotificationType(
    req: Request,
    res: Response,
    next: NextFunction
): Promise<void> {
    try {
        await notificationTypeService.delete(req.params.id);
        res.status(HTTP_STATUS.NO_CONTENT).send();
    } catch (err) {
        next(err);
    }
}

export const createNotificationTypeValidation = [validateBody(createNotificationTypeSchema)];
export const getNotificationTypeByIdValidation = [validateParams(notificationTypeIdParamSchema)];
export const listNotificationTypesValidation = [validateQuery(listNotificationTypesQuerySchema)];
export const updateNotificationTypeValidation = [
    validateParams(notificationTypeIdParamSchema),
    validateBody(updateNotificationTypeSchema),
];
export const deleteNotificationTypeValidation = [validateParams(notificationTypeIdParamSchema)];
