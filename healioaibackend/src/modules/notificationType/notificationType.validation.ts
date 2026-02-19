import Joi from 'joi';
import { paginationQuerySchema } from '../../common/pagination/pagination';

export const createNotificationTypeSchema = Joi.object({
    key: Joi.string()
        .required()
        .trim()
        .lowercase()
        .min(1)
        .max(100)
        .pattern(/^[a-z0-9_]+$/)
        .message('Key must only contain lowercase letters, numbers, and underscores'),
    titleTemplate: Joi.string().required().trim().min(1).max(200),
    messageTemplate: Joi.string().required().trim().min(1).max(1000),
    defaultChannels: Joi.object({
        inApp: Joi.boolean().default(true),
        push: Joi.boolean().default(true),
        sms: Joi.boolean().default(false),
    }).default({ inApp: true, push: true, sms: false }),
    defaultAction: Joi.object({
        label: Joi.string().allow(null, '').optional(),
        route: Joi.string().allow(null, '').optional(),
    }).optional(),
    icon: Joi.string().trim().max(50).default('bell'),
    priority: Joi.number().integer().min(1).max(5).default(3),
});

export const updateNotificationTypeSchema = Joi.object({
    key: Joi.string()
        .trim()
        .lowercase()
        .min(1)
        .max(100)
        .pattern(/^[a-z0-9_]+$/),
    titleTemplate: Joi.string().trim().min(1).max(200),
    messageTemplate: Joi.string().trim().min(1).max(1000),
    defaultChannels: Joi.object({
        inApp: Joi.boolean(),
        push: Joi.boolean(),
        sms: Joi.boolean(),
    }),
    defaultAction: Joi.object({
        label: Joi.string().allow(null, '').optional(),
        route: Joi.string().allow(null, '').optional(),
    }),
    icon: Joi.string().trim().max(50),
    priority: Joi.number().integer().min(1).max(5),
}).min(1);

export const notificationTypeIdParamSchema = Joi.object({
    id: Joi.string().hex().length(24).required(),
});

export const listNotificationTypesQuerySchema = paginationQuerySchema.keys({
    search: Joi.string().optional().allow(''),
    priority: Joi.number().integer().min(1).max(5).optional(),
});

export type CreateNotificationTypeInput = {
    key: string;
    titleTemplate: string;
    messageTemplate: string;
    defaultChannels?: {
        inApp?: boolean;
        push?: boolean;
        sms?: boolean;
    };
    defaultAction?: {
        label?: string | null;
        route?: string | null;
    };
    icon?: string;
    priority?: number;
};

export type UpdateNotificationTypeInput = Partial<CreateNotificationTypeInput>;
