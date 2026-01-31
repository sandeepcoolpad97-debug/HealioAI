import Joi from 'joi';
import { paginationQuerySchema } from '../../common/pagination/pagination';

const phoneSchema = Joi.object({
  countryCode: Joi.string().default('+91').trim(),
  number: Joi.string().required().trim(),
  verified: Joi.boolean().default(false),
});

const consentsSchema = Joi.object({
  termsAndConditions: Joi.boolean().valid(true).required(),
  policyTerms: Joi.boolean().valid(true).required(),
  medicalDisclaimer: Joi.boolean().valid(true).required(),
});

const medicalSchema = Joi.object({
  existingConditions: Joi.array().items(Joi.string()).default([]),
  otherConditions: Joi.string().allow('').optional(),
}).optional();

export const onboardUserSchema = Joi.object({
  firebaseUid: Joi.string().required().trim(),
  name: Joi.string().min(1).max(200).required().trim(),
  age: Joi.number().integer().min(0).max(120).optional(),
  gender: Joi.string().valid('male', 'female', 'other').required(),
  language: Joi.string().default('en').trim(),
  roleId: Joi.string().hex().length(24).required(),
  subscriptionId: Joi.string().hex().length(24).required(),
  email: Joi.string().email().trim().lowercase().allow('').optional(),
  phone: phoneSchema.required(),
  consents: consentsSchema.required(),
  medical: medicalSchema,
});

export const createUserSchema = Joi.object({
  name: Joi.string().min(1).max(200).required().trim(),
  age: Joi.number().integer().min(0).max(120).optional(),
  gender: Joi.string().valid('male', 'female', 'other').required(),
  language: Joi.string().default('en').trim(),
  roleId: Joi.string().hex().length(24).required(),
  subscriptionId: Joi.string().hex().length(24).required(),
  email: Joi.string().email().trim().lowercase().allow('').optional(),
  phone: phoneSchema.required(),
  consents: consentsSchema.required(),
  medical: medicalSchema,
});

export const updateUserSchema = Joi.object({
  name: Joi.string().min(1).max(200).trim(),
  age: Joi.number().integer().min(0).max(120),
  gender: Joi.string().valid('male', 'female', 'other'),
  language: Joi.string().trim(),
  roleId: Joi.string().hex().length(24),
  subscriptionId: Joi.string().hex().length(24),
  subscriptionStatus: Joi.string().valid('active', 'expired', 'cancelled', 'trial'),
  email: Joi.string().email().trim().lowercase().allow(''),
  phone: phoneSchema,
  medical: medicalSchema,
  isActive: Joi.boolean(),
}).min(1);

export const userIdParamSchema = Joi.object({
  id: Joi.string().hex().length(24).required(),
});

export const listUsersQuerySchema = paginationQuerySchema;

export type OnboardUserInput = {
  firebaseUid: string;
  name: string;
  age?: number;
  gender: 'male' | 'female' | 'other';
  language?: string;
  roleId: string;
  subscriptionId: string;
  email?: string;
  phone: { countryCode?: string; number: string; verified?: boolean };
  consents: {
    termsAndConditions: true;
    policyTerms: true;
    medicalDisclaimer: true;
  };
  medical?: {
    existingConditions?: string[];
    otherConditions?: string;
  };
};

export type CreateUserInput = OnboardUserInput;

export type UpdateUserInput = {
  name?: string;
  age?: number;
  gender?: 'male' | 'female' | 'other';
  language?: string;
  roleId?: string;
  subscriptionId?: string;
  subscriptionStatus?: 'active' | 'expired' | 'cancelled' | 'trial';
  email?: string;
  phone?: { countryCode?: string; number: string; verified?: boolean };
  medical?: {
    existingConditions?: string[];
    otherConditions?: string;
  };
  isActive?: boolean;
};
