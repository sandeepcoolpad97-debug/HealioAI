import Joi from 'joi';

export const createDiscountSchema = Joi.object({
  name: Joi.string().required().trim().messages({
    'string.empty': 'Name is required',
    'any.required': 'Name is required',
  }),
  description: Joi.string().allow('').optional(),
  price: Joi.number().required().min(0).messages({
    'number.base': 'Price must be a number',
    'number.min': 'Price cannot be negative',
    'any.required': 'Price is required',
  }),
  serviceId: Joi.string().required().messages({
    'string.empty': 'Service ID is required',
    'any.required': 'Service ID is required',
  }),
  rule: Joi.object().optional().default({}),
});

export const updateDiscountSchema = Joi.object({
  name: Joi.string().trim().optional(),
  description: Joi.string().allow('').optional(),
  price: Joi.number().min(0).optional(),
  serviceId: Joi.string().optional(),
  rule: Joi.object().optional(),
  isActive: Joi.boolean().optional(),
});
