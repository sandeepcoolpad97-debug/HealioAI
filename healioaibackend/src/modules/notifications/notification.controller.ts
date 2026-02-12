import { Request, Response, NextFunction } from 'express';
import { AuthenticatedRequest } from '../../common/middlewares/auth.middleware';
import { NotificationService } from './notification.service';
import {
    createNotificationSchema,
    notificationIdParamSchema,
    bulkMarkAsReadSchema,
    listNotificationsQuerySchema,
    unreadCountQuerySchema,
} from './notification.validation';
import { validateBody, validateParams, validateQuery } from '../../common/validation/validate';
import { HTTP_STATUS } from '../../common/constants';

const notificationService = new NotificationService();

export async function createNotification(
    req: Request,
    res: Response,
    next: NextFunction
): Promise<void> {
    try {
        const authReq = req as AuthenticatedRequest;
        const notification = await notificationService.create(req.body, authReq.userId);
        res.status(HTTP_STATUS.CREATED).json({ success: true, data: notification });
    } catch (err) {
        next(err);
    }
}

export async function getNotificationById(
    req: Request,
    res: Response,
    next: NextFunction
): Promise<void> {
    try {
        const notification = await notificationService.getById(req.params.id);
        res.status(HTTP_STATUS.OK).json({ success: true, data: notification });
    } catch (err) {
        next(err);
    }
}

export async function listNotifications(
    req: Request,
    res: Response,
    next: NextFunction
): Promise<void> {
    try {
        const page = Number(req.query.page) || 1;
        const limit = Number(req.query.limit) || 20;
        const filters = {
            userId: req.query.userId as string | undefined,
            isRead: req.query.isRead !== undefined ? req.query.isRead === 'true' : undefined,
            refType: req.query.refType as string | undefined,
            refId: req.query.refId as string | undefined,
        };
        const result = await notificationService.list(page, limit, filters);
        res.status(HTTP_STATUS.OK).json({ success: true, ...result });
    } catch (err) {
        next(err);
    }
}

export async function markAsRead(
    req: Request,
    res: Response,
    next: NextFunction
): Promise<void> {
    try {
        const authReq = req as AuthenticatedRequest;
        const notification = await notificationService.markAsRead(req.params.id, authReq.userId);
        res.status(HTTP_STATUS.OK).json({ success: true, data: notification });
    } catch (err) {
        next(err);
    }
}

export async function bulkMarkAsRead(
    req: Request,
    res: Response,
    next: NextFunction
): Promise<void> {
    try {
        const authReq = req as AuthenticatedRequest;
        const result = await notificationService.bulkMarkAsRead(authReq.userId!, req.body);
        res.status(HTTP_STATUS.OK).json({ success: true, data: result });
    } catch (err) {
        next(err);
    }
}

export async function getUnreadCount(
    req: Request,
    res: Response,
    next: NextFunction
): Promise<void> {
    try {
        const userId = req.query.userId as string;
        const result = await notificationService.getUnreadCount(userId);
        res.status(HTTP_STATUS.OK).json({ success: true, data: result });
    } catch (err) {
        next(err);
    }
}

export async function deleteNotification(
    req: Request,
    res: Response,
    next: NextFunction
): Promise<void> {
    try {
        await notificationService.delete(req.params.id);
        res.status(HTTP_STATUS.NO_CONTENT).send();
    } catch (err) {
        next(err);
    }
}

export const createNotificationValidation = [validateBody(createNotificationSchema)];
export const getNotificationByIdValidation = [validateParams(notificationIdParamSchema)];
export const listNotificationsValidation = [validateQuery(listNotificationsQuerySchema)];
export const markAsReadValidation = [validateParams(notificationIdParamSchema)];
export const bulkMarkAsReadValidation = [validateBody(bulkMarkAsReadSchema)];
export const unreadCountValidation = [validateQuery(unreadCountQuerySchema)];
export const deleteNotificationValidation = [validateParams(notificationIdParamSchema)];
