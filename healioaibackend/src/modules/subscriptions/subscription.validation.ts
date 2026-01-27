import Joi from 'joi';
import { paginationQuerySchema } from '../../common/pagination/pagination';

export const createSubscriptionSchema = Joi.object({
  name: Joi.string().min(1).max(200).required().trim(),
  code: Joi.string().min(1).max(50).required().trim().lowercase(),
  price: Joi.number().min(0).default(0),
  currency: Joi.string().max(10).default('INR'),
  durationInDays: Joi.number().min(1).allow(null).optional(),
  features: Joi.array().items(Joi.string()).default([]),
  isSystemPlan: Joi.boolean().default(false),
});

export const updateSubscriptionSchema = Joi.object({
  name: Joi.string().min(1).max(200).trim(),
  code: Joi.string().min(1).max(50).trim().lowercase(),
  price: Joi.number().min(0),
  currency: Joi.string().max(10),
  durationInDays: Joi.number().min(1).allow(null).optional(),
  features: Joi.array().items(Joi.string()),
  isSystemPlan: Joi.boolean(),
}).min(1);

export const subscriptionIdParamSchema = Joi.object({
  id: Joi.string().hex().length(24).required(),
});

export const listSubscriptionsQuerySchema = paginationQuerySchema;

export type CreateSubscriptionInput = {
  name: string;
  code: string;
  price?: number;
  currency?: string;
  durationInDays?: number;
  features?: string[];
  isSystemPlan?: boolean;
};

export type UpdateSubscriptionInput = {
  name?: string;
  code?: string;
  price?: number;
  currency?: string;
  durationInDays?: number;
  features?: string[];
  isSystemPlan?: boolean;
};
