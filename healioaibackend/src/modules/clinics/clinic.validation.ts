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

export const createClinicSchema = Joi.object({
  clinicName: Joi.string().min(1).max(200).required().trim(),
  registrationNumber: Joi.string().min(1).max(100).required().trim(),
  roleId: Joi.string().hex().length(24).required(),
  address: Joi.string().min(1).max(500).trim().allow('').optional(),
  establishmentDate: Joi.date().optional(),
  contactNumber: Joi.string().min(1).max(20).required().trim(),
  emailId: Joi.string().email().trim().lowercase().allow('').optional(),
  operatingHours: Joi.array().items(operatingHoursItemSchema).default([]),
  specialisation: Joi.array().items(Joi.string()).default([]),
  consultationType: Joi.string().valid('in_person', 'online', 'both').default('in_person'),
  doctorName: Joi.string().min(1).max(200).required().trim(),
  consents: consentsSchema.required(),
});

export const updateClinicSchema = Joi.object({
  clinicName: Joi.string().min(1).max(200).trim(),
  registrationNumber: Joi.string().min(1).max(100).trim(),
  roleId: Joi.string().hex().length(24),
  address: Joi.string().min(1).max(500).trim().allow(''),
  establishmentDate: Joi.date(),
  contactNumber: Joi.string().min(1).max(20).trim(),
  emailId: Joi.string().email().trim().lowercase().allow(''),
  operatingHours: Joi.array().items(operatingHoursItemSchema),
  specialisation: Joi.array().items(Joi.string()),
  consultationType: Joi.string().valid('in_person', 'online', 'both'),
  doctorName: Joi.string().min(1).max(200).trim(),
  consents: consentsSchema,
}).min(1);

export const clinicIdParamSchema = Joi.object({
  id: Joi.string().hex().length(24).required(),
});

export const listClinicsQuerySchema = paginationQuerySchema;

export type CreateClinicInput = {
  clinicName: string;
  registrationNumber: string;
  roleId: string;
  address?: string;
  establishmentDate?: Date;
  contactNumber: string;
  emailId?: string;
  operatingHours?: {
    day: 'Mon' | 'Tue' | 'Wed' | 'Thu' | 'Fri' | 'Sat' | 'Sun';
    openTime: string;
    closeTime: string;
    isClosed?: boolean;
  }[];
  specialisation?: string[];
  consultationType?: 'in_person' | 'online' | 'both';
  doctorName: string;
  consents: {
    termsAndConditions: true;
    policyTerms: true;
    medicalDisclaimer: true;
  };
};

export type UpdateClinicInput = {
  clinicName?: string;
  registrationNumber?: string;
  roleId?: string;
  address?: string;
  establishmentDate?: Date;
  contactNumber?: string;
  emailId?: string;
  operatingHours?: {
    day: 'Mon' | 'Tue' | 'Wed' | 'Thu' | 'Fri' | 'Sat' | 'Sun';
    openTime: string;
    closeTime: string;
    isClosed?: boolean;
  }[];
  specialisation?: string[];
  consultationType?: 'in_person' | 'online' | 'both';
  doctorName?: string;
  consents?: {
    termsAndConditions: true;
    policyTerms: true;
    medicalDisclaimer: true;
  };
};
