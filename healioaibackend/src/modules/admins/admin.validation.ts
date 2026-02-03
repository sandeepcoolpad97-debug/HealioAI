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
});

export const onboardAdminSchema = Joi.object({
  firebaseUid: Joi.string().required().trim(),
  name: Joi.string().min(1).max(200).required().trim(),
  gender: Joi.string().valid('male', 'female', 'other').required(),
  language: Joi.string().default('en').trim(),
  roleId: Joi.string().hex().length(24).required(),
  email: Joi.string().email().required().trim().lowercase(),
  phone: phoneSchema.required(),
  address: Joi.string().trim().optional().allow(''),
  consents: consentsSchema.required(),
});

export const createAdminSchema = Joi.object({
  name: Joi.string().min(1).max(200).required().trim(),
  gender: Joi.string().valid('male', 'female', 'other').required(),
  language: Joi.string().default('en').trim(),
  roleId: Joi.string().hex().length(24).required(),
  email: Joi.string().email().required().trim().lowercase(),
  phone: phoneSchema.required(),
  address: Joi.string().trim().optional().allow(''),
  consents: consentsSchema.required(),
});

export const updateAdminSchema = Joi.object({
  name: Joi.string().min(1).max(200).trim(),
  gender: Joi.string().valid('male', 'female', 'other'),
  language: Joi.string().trim(),
  roleId: Joi.string().hex().length(24),
  email: Joi.string().email().trim().lowercase(),
  phone: phoneSchema,
  address: Joi.string().trim().allow(''),
  isActive: Joi.boolean(),
}).min(1);

export const getAdminByIdSchema = Joi.object({
  id: Joi.string().hex().length(24).required(),
});

export const deleteAdminSchema = Joi.object({
  id: Joi.string().hex().length(24).required(),
});

export const loginAdminSchema = Joi.object({
  firebaseUid: Joi.string().required().trim(),
  email: Joi.string().email().required().trim().lowercase(),
  idToken: Joi.string().required().trim(),
});

export const listAdminsSchema = paginationQuerySchema;

export type OnboardAdminInput = {
  firebaseUid: string;
  name: string;
  gender: 'male' | 'female' | 'other';
  language?: string;
  roleId: string;
  email: string;
  phone: { countryCode?: string; number: string; verified?: boolean };
  address?: string;
  consents: {
    termsAndConditions: true;
    policyTerms: true;
  };
};

export type LoginAdminInput = {
  firebaseUid: string;
  email: string;
  idToken: string;
};

export type CreateAdminInput = {
  name: string;
  gender: 'male' | 'female' | 'other';
  language?: string;
  roleId: string;
  email: string;
  phone: { countryCode?: string; number: string; verified?: boolean };
  address?: string;
  consents: {
    termsAndConditions: true;
    policyTerms: true;
  };
};

export type UpdateAdminInput = {
  name?: string;
  gender?: 'male' | 'female' | 'other';
  language?: string;
  roleId?: string;
  email?: string;
  phone?: { countryCode?: string; number: string; verified?: boolean };
  address?: string;
  isActive?: boolean;
};
