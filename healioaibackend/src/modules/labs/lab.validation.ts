import Joi from 'joi';
import { paginationQuerySchema } from '../../common/pagination/pagination';

const operatingHoursItemSchema = Joi.object({
  day: Joi.string().valid('Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun').required(),
  openTime: Joi.string().required().trim(),
  closeTime: Joi.string().required().trim(),
  isClosed: Joi.boolean().default(false),
});

const consentsSchema = Joi.object({
  termsAndConditions: Joi.boolean().valid(true).required(),
  policyTerms: Joi.boolean().valid(true).required(),
  medicalDisclaimer: Joi.boolean().valid(true).required(),
});

const reportDeliveryType = ['pdf', 'in_app'];

export const createLabSchema = Joi.object({
  labName: Joi.string().min(1).max(200).required().trim(),
  registrationNumber: Joi.string().min(1).max(100).required().trim(),
  roleId: Joi.string().hex().length(24).required(),
  address: Joi.string().min(1).max(500).required().trim(),
  contactNumber: Joi.string().min(1).max(20).required().trim(),
  emailId: Joi.string().email().trim().lowercase().allow('').optional(),
  operatingHours: Joi.array().items(operatingHoursItemSchema).default([]),
  services: Joi.object({
    testCategories: Joi.array()
      .items(Joi.string().trim())
      .default([]),
    homeSampleCollection: Joi.boolean().default(false),
    reportDeliveryType: Joi.array()
      .items(Joi.string().valid(...reportDeliveryType))
      .default([]),
  }).default({ testCategories: [], homeSampleCollection: false, reportDeliveryType: [] }),
  consents: consentsSchema.required(),
});

export const updateLabSchema = Joi.object({
  labName: Joi.string().min(1).max(200).trim(),
  registrationNumber: Joi.string().min(1).max(100).trim(),
  roleId: Joi.string().hex().length(24),
  address: Joi.string().min(1).max(500).trim(),
  contactNumber: Joi.string().min(1).max(20).trim(),
  emailId: Joi.string().email().trim().lowercase().allow(''),
  operatingHours: Joi.array().items(operatingHoursItemSchema),
  services: Joi.object({
    testCategories: Joi.array().items(Joi.string().trim()),
    homeSampleCollection: Joi.boolean(),
    reportDeliveryType: Joi.array().items(Joi.string().valid(...reportDeliveryType)),
  }),
  consents: consentsSchema,
}).min(1);

export const labIdParamSchema = Joi.object({
  id: Joi.string().hex().length(24).required(),
});

export const listLabsQuerySchema = paginationQuerySchema;

export type CreateLabInput = {
  labName: string;
  registrationNumber: string;
  roleId: string;
  address: string;
  contactNumber: string;
  emailId?: string;
  operatingHours?: {
    day: 'Mon' | 'Tue' | 'Wed' | 'Thu' | 'Fri' | 'Sat' | 'Sun';
    openTime: string;
    closeTime: string;
    isClosed?: boolean;
  }[];
  services?: {
    testCategories?: string[];
    homeSampleCollection?: boolean;
    reportDeliveryType?: ('pdf' | 'in_app')[];
  };
  consents: {
    termsAndConditions: true;
    policyTerms: true;
    medicalDisclaimer: true;
  };
};

export type UpdateLabInput = {
  labName?: string;
  registrationNumber?: string;
  roleId?: string;
  address?: string;
  contactNumber?: string;
  emailId?: string;
  operatingHours?: {
    day: 'Mon' | 'Tue' | 'Wed' | 'Thu' | 'Fri' | 'Sat' | 'Sun';
    openTime: string;
    closeTime: string;
    isClosed?: boolean;
  }[];
  services?: {
    testCategories?: string[];
    homeSampleCollection?: boolean;
    reportDeliveryType?: ('pdf' | 'in_app')[];
  };
  consents?: {
    termsAndConditions: true;
    policyTerms: true;
    medicalDisclaimer: true;
  };
};
