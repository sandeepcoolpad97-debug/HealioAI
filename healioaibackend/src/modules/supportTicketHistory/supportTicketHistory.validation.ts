import Joi from 'joi';
import { paginationQuerySchema } from '../../common/pagination/pagination';

export const createHistoryEntrySchema = Joi.object({
    ticketId: Joi.string().hex().length(24).required(),
    action: Joi.string()
        .valid(
            'created',
            'user_reply',
            'agent_reply',
            'status_changed',
            'priority_changed',
            'category_changed',
            'assigned',
            'closed',
            'reopened'
        )
        .required(),
    message: Joi.string().allow(null, '').optional(),
    oldValue: Joi.object().allow(null).optional(),
    newValue: Joi.object().allow(null).optional(),
    performedByRole: Joi.string()
        .valid('User', 'Clinic', 'Lab', 'Admin', 'SupportAgent', 'System')
        .required(),
    performedById: Joi.string().hex().length(24).allow(null).optional(),
    attachments: Joi.array().items(Joi.string().hex().length(24)).default([]),
});

export const ticketIdParamSchema = Joi.object({
    ticketId: Joi.string().hex().length(24).required(),
});

export const listHistoryQuerySchema = paginationQuerySchema.keys({
    ticketId: Joi.string().hex().length(24).optional(),
    action: Joi.string()
        .valid(
            'created',
            'user_reply',
            'agent_reply',
            'status_changed',
            'priority_changed',
            'category_changed',
            'assigned',
            'closed',
            'reopened'
        )
        .optional(),
    performedByRole: Joi.string()
        .valid('User', 'Clinic', 'Lab', 'Admin', 'SupportAgent', 'System')
        .optional(),
});

export type CreateHistoryEntryInput = {
    ticketId: string;
    action:
    | 'created'
    | 'user_reply'
    | 'agent_reply'
    | 'status_changed'
    | 'priority_changed'
    | 'category_changed'
    | 'assigned'
    | 'closed'
    | 'reopened';
    message?: string | null;
    oldValue?: any;
    newValue?: any;
    performedByRole: 'User' | 'Clinic' | 'Lab' | 'Admin' | 'SupportAgent' | 'System';
    performedById?: string | null;
    attachments?: {
        fileName: string;
        fileUrl: string;
        fileType: string;
        fileSize: number;
    }[];
};
