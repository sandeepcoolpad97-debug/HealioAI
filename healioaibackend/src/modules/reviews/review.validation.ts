import Joi from 'joi';
import { paginationQuerySchema } from '../../common/pagination/pagination';

export const createReviewSchema = Joi.object({
    appointmentId: Joi.string().hex().length(24).required().messages({
        'string.empty': 'Appointment ID is required',
        'any.required': 'Appointment ID is required',
    }),
    userId: Joi.string().hex().length(24).required().messages({
        'string.empty': 'User ID is required',
        'any.required': 'User ID is required',
    }),
    reviewFor: Joi.string().valid('Clinic', 'Lab').required().messages({
        'any.only': 'Review must be for Clinic or Lab',
        'any.required': 'Review type is required',
    }),
    reviewForId: Joi.string().hex().length(24).required().messages({
        'string.empty': 'Review target ID is required',
        'any.required': 'Review target ID is required',
    }),
    rating: Joi.number().integer().min(1).max(5).required().messages({
        'number.min': 'Rating must be at least 1',
        'number.max': 'Rating cannot exceed 5',
        'any.required': 'Rating is required',
    }),
    comment: Joi.string().max(1000).allow('').optional(),
});

export const updateReviewSchema = Joi.object({
    rating: Joi.number().integer().min(1).max(5).optional(),
    comment: Joi.string().max(1000).allow('').optional(),
    isActive: Joi.boolean().optional(),
}).min(1);

export const reviewIdParamSchema = Joi.object({
    id: Joi.string().hex().length(24).required(),
});

export const listReviewsQuerySchema = paginationQuerySchema.keys({
    reviewFor: Joi.string().valid('Clinic', 'Lab').optional(),
    reviewForId: Joi.string().hex().length(24).optional(),
    userId: Joi.string().hex().length(24).optional(),
});

export type CreateReviewInput = {
    appointmentId: string;
    userId: string;
    reviewFor: 'Clinic' | 'Lab';
    reviewForId: string;
    rating: number;
    comment?: string;
};

export type UpdateReviewInput = {
    rating?: number;
    comment?: string;
    isActive?: boolean;
};
