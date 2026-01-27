import Joi from 'joi';
import { paginationQuerySchema } from '../../common/pagination/pagination';

export const createUserSchema = Joi.object({
  email: Joi.string().email().required().trim().lowercase(),
  name: Joi.string().min(1).max(200).required().trim(),
});

export const updateUserSchema = Joi.object({
  email: Joi.string().email().trim().lowercase(),
  name: Joi.string().min(1).max(200).trim(),
}).min(1);

export const userIdParamSchema = Joi.object({
  id: Joi.string().hex().length(24).required(),
});

export const listUsersQuerySchema = paginationQuerySchema;

export type CreateUserInput = {
  email: string;
  name: string;
};

export type UpdateUserInput = {
  email?: string;
  name?: string;
};
