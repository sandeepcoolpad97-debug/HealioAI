import { Request, Response, NextFunction } from 'express';
import { AuthenticatedRequest } from '../../common/middlewares/auth.middleware';
import { SupportTicketService } from './supportTicket.service';
import {
    createSupportTicketSchema,
    updateSupportTicketSchema,
    updateStatusSchema,
    assignTicketSchema,
    updatePrioritySchema,
    addReplySchema,
    supportTicketIdParamSchema,
    ticketIdParamSchema,
    listSupportTicketsQuerySchema,
} from './supportTicket.validation';
import { validateBody, validateParams, validateQuery } from '../../common/validation/validate';
import { HTTP_STATUS } from '../../common/constants';

const supportTicketService = new SupportTicketService();

export async function createTicket(
    req: Request,
    res: Response,
    next: NextFunction
): Promise<void> {
    try {
        const authReq = req as AuthenticatedRequest;
        const ticket = await supportTicketService.create(req.body, authReq.userId);
        res.status(HTTP_STATUS.CREATED).json({ success: true, data: ticket });
    } catch (err) {
        next(err);
    }
}

export async function getTicketById(
    req: Request,
    res: Response,
    next: NextFunction
): Promise<void> {
    try {
        const ticket = await supportTicketService.getById(req.params.id);
        res.status(HTTP_STATUS.OK).json({ success: true, data: ticket });
    } catch (err) {
        next(err);
    }
}

export async function getTicketByTicketId(
    req: Request,
    res: Response,
    next: NextFunction
): Promise<void> {
    try {
        const ticket = await supportTicketService.getByTicketId(req.params.ticketId);
        res.status(HTTP_STATUS.OK).json({ success: true, data: ticket });
    } catch (err) {
        next(err);
    }
}

export async function listTickets(
    req: Request,
    res: Response,
    next: NextFunction
): Promise<void> {
    try {
        const page = Number(req.query.page) || 1;
        const limit = Number(req.query.limit) || 20;
        const filters = {
            raisedById: req.query.raisedById as string | undefined,
            raisedByRole: req.query.raisedByRole as string | undefined,
            status: req.query.status as string | undefined,
            priority: req.query.priority as string | undefined,
            assignedToId: req.query.assignedToId as string | undefined,
            category: req.query.category as string | undefined,
            search: req.query.search as string | undefined,
        };
        const result = await supportTicketService.list(page, limit, filters);
        res.status(HTTP_STATUS.OK).json({ success: true, ...result });
    } catch (err) {
        next(err);
    }
}

export async function updateTicket(
    req: Request,
    res: Response,
    next: NextFunction
): Promise<void> {
    try {
        const authReq = req as AuthenticatedRequest;
        const ticket = await supportTicketService.update(req.params.id, req.body, authReq.userId);
        res.status(HTTP_STATUS.OK).json({ success: true, data: ticket });
    } catch (err) {
        next(err);
    }
}

export async function updateStatus(
    req: Request,
    res: Response,
    next: NextFunction
): Promise<void> {
    try {
        const authReq = req as AuthenticatedRequest;
        const { performedByRole, performedById } = req.body;
        const ticket = await supportTicketService.updateStatus(
            req.params.id,
            { status: req.body.status },
            performedByRole,
            performedById,
            authReq.userId
        );
        res.status(HTTP_STATUS.OK).json({ success: true, data: ticket });
    } catch (err) {
        next(err);
    }
}

export async function assignTicket(
    req: Request,
    res: Response,
    next: NextFunction
): Promise<void> {
    try {
        const authReq = req as AuthenticatedRequest;
        const { assignedToRole, assignedToId, performedByRole, performedById } = req.body;
        const ticket = await supportTicketService.assignTicket(
            req.params.id,
            { assignedToRole, assignedToId },
            performedByRole,
            performedById,
            authReq.userId
        );
        res.status(HTTP_STATUS.OK).json({ success: true, data: ticket });
    } catch (err) {
        next(err);
    }
}

export async function updatePriority(
    req: Request,
    res: Response,
    next: NextFunction
): Promise<void> {
    try {
        const authReq = req as AuthenticatedRequest;
        const { priority, performedByRole, performedById } = req.body;
        const ticket = await supportTicketService.updatePriority(
            req.params.id,
            { priority },
            performedByRole,
            performedById,
            authReq.userId
        );
        res.status(HTTP_STATUS.OK).json({ success: true, data: ticket });
    } catch (err) {
        next(err);
    }
}

export async function addReply(
    req: Request,
    res: Response,
    next: NextFunction
): Promise<void> {
    try {
        await supportTicketService.addReply(req.params.id, req.body);
        res.status(HTTP_STATUS.OK).json({ success: true, message: 'Reply added successfully' });
    } catch (err) {
        next(err);
    }
}

export async function deleteTicket(
    req: Request,
    res: Response,
    next: NextFunction
): Promise<void> {
    try {
        await supportTicketService.delete(req.params.id);
        res.status(HTTP_STATUS.NO_CONTENT).send();
    } catch (err) {
        next(err);
    }
}

export const createTicketValidation = [validateBody(createSupportTicketSchema)];
export const getTicketByIdValidation = [validateParams(supportTicketIdParamSchema)];
export const getTicketByTicketIdValidation = [validateParams(ticketIdParamSchema)];
export const listTicketsValidation = [validateQuery(listSupportTicketsQuerySchema)];
export const updateTicketValidation = [
    validateParams(supportTicketIdParamSchema),
    validateBody(updateSupportTicketSchema),
];
export const updateStatusValidation = [
    validateParams(supportTicketIdParamSchema),
    validateBody(updateStatusSchema),
];
export const assignTicketValidation = [
    validateParams(supportTicketIdParamSchema),
    validateBody(assignTicketSchema),
];
export const updatePriorityValidation = [
    validateParams(supportTicketIdParamSchema),
    validateBody(updatePrioritySchema),
];
export const addReplyValidation = [
    validateParams(supportTicketIdParamSchema),
    validateBody(addReplySchema),
];
export const deleteTicketValidation = [validateParams(supportTicketIdParamSchema)];
