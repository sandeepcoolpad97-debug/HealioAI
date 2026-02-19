import Joi from 'joi';

export const createMediaSchema = Joi.object({
  file: Joi.string().required(),
  folder: Joi.string().optional(),
  ownerType: Joi.string().optional(),
  ownerId: Joi.string().hex().length(24).optional(),
  tags: Joi.array().items(Joi.string()).default([]),
  description: Joi.string().allow('').optional(),
  context: Joi.object().unknown(true).optional(),
});

export const updateMediaSchema = Joi.object({
  file: Joi.string(),
  folder: Joi.string(),
  ownerType: Joi.string(),
  ownerId: Joi.string().hex().length(24),
  tags: Joi.array().items(Joi.string()),
  description: Joi.string().allow(''),
  context: Joi.object().unknown(true),
}).min(1);

export const mediaIdParamSchema = Joi.object({
  id: Joi.string().hex().length(24).required(),
});

export type CreateMediaInput = {
  file: string;
  folder?: string;
  ownerType?: string;
  ownerId?: string;
  tags?: string[];
  description?: string;
  context?: Record<string, any>;
};

export type UpdateMediaInput = {
  file?: string;
  folder?: string;
  ownerType?: string;
  ownerId?: string;
  tags?: string[];
  description?: string;
  context?: Record<string, any>;
};

