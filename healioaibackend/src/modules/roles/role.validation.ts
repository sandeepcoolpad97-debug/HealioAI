import Joi from 'joi';
import { paginationQuerySchema } from '../../common/pagination/pagination';

export const createRoleSchema = Joi.object({
  name: Joi.string().min(1).max(100).required().trim().lowercase(),
  description: Joi.string().max(500).allow('').optional(),
  permissions: Joi.array().items(Joi.string()).default([]),
  isSystemRole: Joi.boolean().default(false),
});

export const updateRoleSchema = Joi.object({
  name: Joi.string().min(1).max(100).trim().lowercase(),
  description: Joi.string().max(500).allow('').optional(),
  permissions: Joi.array().items(Joi.string()),
  isSystemRole: Joi.boolean(),
}).min(1);

export const roleIdParamSchema = Joi.object({
  id: Joi.string().hex().length(24).required(),
});

export const listRolesQuerySchema = paginationQuerySchema;

export type CreateRoleInput = {
  name: string;
  description?: string;
  permissions?: string[];
  isSystemRole?: boolean;
};

export type UpdateRoleInput = {
  name?: string;
  description?: string;
  permissions?: string[];
  isSystemRole?: boolean;
};
