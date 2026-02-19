import Joi from 'joi';

export const createServiceSchema = Joi.object({
  name: Joi.string().required().trim().messages({
    'string.empty': 'Name is required',
    'any.required': 'Name is required',
  }),
  code: Joi.string().required().trim().lowercase().messages({
    'string.empty': 'Code is required',
    'any.required': 'Code is required',
  }),
  description: Joi.string().allow('').optional(),
});

export const updateServiceSchema = Joi.object({
  name: Joi.string().trim().optional(),
  code: Joi.string().trim().lowercase().optional(),
  description: Joi.string().allow('').optional(),
  isActive: Joi.boolean().optional(),
});
