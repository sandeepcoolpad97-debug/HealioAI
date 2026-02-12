import Joi from 'joi';
import { paginationQuerySchema } from '../../common/pagination/pagination';

export const createNotificationSchema = Joi.object({
    userId: Joi.string().hex().length(24).required().messages({
        'string.empty': 'User ID is required',
        'any.required': 'User ID is required',
    }),
    typeId: Joi.string().hex().length(24).required().messages({
        'string.empty': 'Notification type ID is required',
        'any.required': 'Notification type ID is required',
    }),
    title: Joi.string().required().trim().min(1).max(200),
    message: Joi.string().required().trim().min(1).max(1000),
    action: Joi.object({
        label: Joi.string().allow(null, '').optional(),
        route: Joi.string().allow(null, '').optional(),
        meta: Joi.object().optional(),
    }).optional(),
    channels: Joi.object({
        inApp: Joi.boolean().default(true),
        push: Joi.boolean().default(true),
        sms: Joi.boolean().default(false),
    }).default({ inApp: true, push: true, sms: false }),
    reference: Joi.object({
        refType: Joi.string().valid('Appointment', 'LabOrder', 'Payment', 'Clinic', 'General').default('General'),
        refId: Joi.string().hex().length(24).allow(null).optional(),
    }).optional(),
});

export const updateNotificationSchema = Joi.object({
    isRead: Joi.boolean().optional(),
}).min(1);

export const notificationIdParamSchema = Joi.object({
    id: Joi.string().hex().length(24).required(),
});

export const bulkMarkAsReadSchema = Joi.object({
    notificationIds: Joi.array().items(Joi.string().hex().length(24)).min(1).required(),
});

export const listNotificationsQuerySchema = paginationQuerySchema.keys({
    userId: Joi.string().hex().length(24).optional(),
    isRead: Joi.boolean().optional(),
    refType: Joi.string().valid('Appointment', 'LabOrder', 'Payment', 'Clinic', 'General').optional(),
    refId: Joi.string().hex().length(24).optional(),
});

export const unreadCountQuerySchema = Joi.object({
    userId: Joi.string().hex().length(24).required(),
});

export type CreateNotificationInput = {
    userId: string;
    typeId: string;
    title: string;
    message: string;
    action?: {
        label?: string | null;
        route?: string | null;
        meta?: Record<string, any>;
    };
    channels?: {
        inApp?: boolean;
        push?: boolean;
        sms?: boolean;
    };
    reference?: {
        refType?: 'Appointment' | 'LabOrder' | 'Payment' | 'Clinic' | 'General';
        refId?: string | null;
    };
};

export type UpdateNotificationInput = {
    isRead?: boolean;
};

export type BulkMarkAsReadInput = {
    notificationIds: string[];
};
