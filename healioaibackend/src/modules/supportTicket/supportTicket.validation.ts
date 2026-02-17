import Joi from 'joi';
import { paginationQuerySchema } from '../../common/pagination/pagination';

export const createSupportTicketSchema = Joi.object({
    raisedByRole: Joi.string().valid('User', 'Clinic', 'Lab', 'Admin').required(),
    raisedById: Joi.string().hex().length(24).required(),
    subject: Joi.string().required().trim().min(1).max(200),
    description: Joi.string().required().trim().min(1).max(2000),
    category: Joi.string().required().trim().min(1).max(100),
    subCategory: Joi.string().required().trim().min(1).max(100),
    priority: Joi.string().valid('low', 'medium', 'high', 'urgent').default('medium'),
    reference: Joi.object({
        refType: Joi.string().valid('Appointment', 'Payment', 'LabOrder', 'Prescription', 'General').default('General'),
        refId: Joi.string().hex().length(24).allow(null).optional(),
    }).optional(),
    attachments: Joi.array().items(Joi.string().hex().length(24)).default([]),
});

export const updateSupportTicketSchema = Joi.object({
    subject: Joi.string().trim().min(1).max(200),
    description: Joi.string().trim().min(1).max(2000),
    category: Joi.string().trim().min(1).max(100),
    subCategory: Joi.string().trim().min(1).max(100),
}).min(1);

export const updateStatusSchema = Joi.object({
    status: Joi.string().valid('open', 'in_progress', 'closed').required(),
});

export const assignTicketSchema = Joi.object({
    assignedToRole: Joi.string().valid('Admin', 'SupportAgent').required(),
    assignedToId: Joi.string().hex().length(24).required(),
});

export const updatePrioritySchema = Joi.object({
    priority: Joi.string().valid('low', 'medium', 'high', 'urgent').required(),
});

export const addReplySchema = Joi.object({
    message: Joi.string().required().trim().min(1).max(2000),
    performedByRole: Joi.string().valid('User', 'Clinic', 'Lab', 'Admin', 'SupportAgent').required(),
    performedById: Joi.string().hex().length(24).required(),
    attachments: Joi.array().items(Joi.string().hex().length(24)).default([]),
});

export const supportTicketIdParamSchema = Joi.object({
    id: Joi.string().hex().length(24).required(),
});

export const ticketIdParamSchema = Joi.object({
    ticketId: Joi.string().required().pattern(/^SUP-\d{5}$/),
});

export const listSupportTicketsQuerySchema = paginationQuerySchema.keys({
    raisedById: Joi.string().hex().length(24).optional(),
    raisedByRole: Joi.string().valid('User', 'Clinic', 'Lab', 'Admin').optional(),
    status: Joi.string().valid('open', 'in_progress', 'closed').optional(),
    priority: Joi.string().valid('low', 'medium', 'high', 'urgent').optional(),
    assignedToId: Joi.string().hex().length(24).optional(),
    category: Joi.string().optional(),
    search: Joi.string().optional().allow(''),
});

export type CreateSupportTicketInput = {
    raisedByRole: 'User' | 'Clinic' | 'Lab' | 'Admin';
    raisedById: string;
    subject: string;
    description: string;
    category: string;
    subCategory: string;
    priority?: 'low' | 'medium' | 'high' | 'urgent';
    reference?: {
        refType?: 'Appointment' | 'Payment' | 'LabOrder' | 'Prescription' | 'General';
        refId?: string | null;
    };
    attachments?: string[];
};

export type UpdateSupportTicketInput = {
    subject?: string;
    description?: string;
    category?: string;
    subCategory?: string;
};

export type UpdateStatusInput = {
    status: 'open' | 'in_progress' | 'closed';
};

export type AssignTicketInput = {
    assignedToRole: 'Admin' | 'SupportAgent';
    assignedToId: string;
};

export type UpdatePriorityInput = {
    priority: 'low' | 'medium' | 'high' | 'urgent';
};

export type AddReplyInput = {
    message: string;
    performedByRole: 'User' | 'Clinic' | 'Lab' | 'Admin' | 'SupportAgent';
    performedById: string;
    attachments?: string[];
};
