import Joi from 'joi';
import { paginationQuerySchema } from '../../common/pagination/pagination';

export const createCategorySchema = Joi.object({
  name: Joi.string().required().trim().min(1).max(100),
  code: Joi.string().required().trim().min(1).max(50).lowercase().pattern(/^[a-z0-9_]+$/).message('Code must only contain lowercase letters, numbers, and underscores'),
  type: Joi.string().valid('reschedule', 'cancellation', 'both').default('both'),
  description: Joi.string().allow('').optional().max(500),
  isActive: Joi.boolean().default(true),
});

export const updateCategorySchema = Joi.object({
  name: Joi.string().trim().min(1).max(100),
  code: Joi.string().trim().min(1).max(50).lowercase().pattern(/^[a-z0-9_]+$/),
  type: Joi.string().valid('reschedule', 'cancellation', 'both'),
  description: Joi.string().allow('').optional().max(500),
  isActive: Joi.boolean(),
}).min(1);

export const categoryIdParamSchema = Joi.object({
  id: Joi.string().hex().length(24).required(),
});

export const listCategoriesQuerySchema = paginationQuerySchema.keys({
  isActive: Joi.boolean().optional(),
  type: Joi.string().valid('reschedule', 'cancellation', 'both').optional(),
  search: Joi.string().optional().allow(''),
});

export type CreateCategoryInput = {
  name: string;
  code: string;
  type?: 'reschedule' | 'cancellation' | 'both';
  description?: string;
  isActive?: boolean;
};

export type UpdateCategoryInput = Partial<CreateCategoryInput>;
