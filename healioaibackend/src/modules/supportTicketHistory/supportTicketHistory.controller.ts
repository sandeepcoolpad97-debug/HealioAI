import { Request, Response, NextFunction } from 'express';
import { AuthenticatedRequest } from '../../common/middlewares/auth.middleware';
import { SupportTicketHistoryService } from './supportTicketHistory.service';
import {
    createHistoryEntrySchema,
    ticketIdParamSchema,
    listHistoryQuerySchema,
} from './supportTicketHistory.validation';
import { validateBody, validateParams, validateQuery } from '../../common/validation/validate';
import { HTTP_STATUS } from '../../common/constants';

const historyService = new SupportTicketHistoryService();

export async function createHistoryEntry(
    req: Request,
    res: Response,
    next: NextFunction
): Promise<void> {
    try {
        const authReq = req as AuthenticatedRequest;
        const entry = await historyService.create(req.body, authReq.userId);
        res.status(HTTP_STATUS.CREATED).json({ success: true, data: entry });
    } catch (err) {
        next(err);
    }
}

export async function getHistoryByTicketId(
    req: Request,
    res: Response,
    next: NextFunction
): Promise<void> {
    try {
        const page = Number(req.query.page);
        const limit = Number(req.query.limit);

        if (page && limit) {
            const result = await historyService.getByTicketIdPaginated(req.params.ticketId, page, limit);
            res.status(HTTP_STATUS.OK).json({ success: true, ...result });
        } else {
            const history = await historyService.getByTicketId(req.params.ticketId);
            res.status(HTTP_STATUS.OK).json({ success: true, data: history });
        }
    } catch (err) {
        next(err);
    }
}

export async function listHistory(
    req: Request,
    res: Response,
    next: NextFunction
): Promise<void> {
    try {
        const page = Number(req.query.page) || 1;
        const limit = Number(req.query.limit) || 20;
        const filters = {
            ticketId: req.query.ticketId as string | undefined,
            action: req.query.action as string | undefined,
            performedByRole: req.query.performedByRole as string | undefined,
        };
        const result = await historyService.list(page, limit, filters);
        res.status(HTTP_STATUS.OK).json({ success: true, ...result });
    } catch (err) {
        next(err);
    }
}

export const createHistoryEntryValidation = [validateBody(createHistoryEntrySchema)];
export const getHistoryByTicketIdValidation = [validateParams(ticketIdParamSchema)];
export const listHistoryValidation = [validateQuery(listHistoryQuerySchema)];
