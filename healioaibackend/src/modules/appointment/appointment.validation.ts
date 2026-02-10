import Joi from 'joi';
import { paginationQuerySchema } from '../../common/pagination/pagination';

export const createAppointmentSchema = Joi.object({
  doctorId: Joi.string().hex().length(24).required(),
  userId: Joi.string().hex().length(24).required(),
  paymentId: Joi.string().hex().length(24).required(),
  currentStartAt: Joi.date().iso().greater('now').required(),
  consultationType: Joi.string().valid('online', 'in_person').default('in_person'),
  consultationDuration: Joi.number().min(5).default(30),
  offersApplied: Joi.array().items(Joi.string().hex().length(24)).default([]),
  appointmentInfo: Joi.array().items(
    Joi.object({
      startAt: Joi.date().iso().required(),
      action: Joi.string().valid('booked', 'rescheduled', 'cancelled').default('booked'),
      notes: Joi.string().trim().max(1000).optional(),
      symptoms: Joi.array().items(Joi.string().trim()).default([]),
    })
  ).required(),
});

export const rescheduleAppointmentSchema = Joi.object({
  newStartAt: Joi.date().iso().greater('now').required(),
  reason: Joi.string().trim().min(10).max(500).required(),
  symptoms: Joi.array().items(Joi.string().trim()).optional(),
  rescheduleCategory: Joi.string().valid(
    'patient_request',
    'doctor_unavailable',
    'emergency',
    'technical_issue',
    'other'
  ).default('patient_request'),
  rescheduledByRole: Joi.string().valid('user', 'doctor', 'lab', 'admin').optional(),
  rescheduledById: Joi.string().hex().length(24).optional(),
  notifyPatient: Joi.boolean().default(true),
  notifyDoctor: Joi.boolean().default(true),
});

export const cancelAppointmentSchema = Joi.object({
  reason: Joi.string().trim().min(10).max(500).required(),
  cancellationCategory: Joi.string().valid(
    'patient_cancelled',
    'doctor_cancelled',
    'medical_emergency',
    'duplicate_booking',
    'payment_failed',
    'other'
  ).default('patient_cancelled'),
  requestRefund: Joi.boolean().default(false),
  notifyPatient: Joi.boolean().default(true),
  notifyDoctor: Joi.boolean().default(true),
});

export const appointmentIdParamSchema = Joi.object({
  id: Joi.string().hex().length(24).required(),
});

export const listAppointmentsQuerySchema = paginationQuerySchema.keys({
  doctorId: Joi.string().hex().length(24).optional(),
  userId: Joi.string().hex().length(24).optional(),
  status: Joi.string().valid('confirmed', 'rescheduled', 'cancelled').optional(),
  date: Joi.date().iso().optional(),
  timeframe: Joi.string().valid('upcoming', 'past').optional(),
});

export type CreateAppointmentInput = {
  doctorId: string;
  userId: string;
  paymentId: string;
  currentStartAt: Date;
  consultationType: 'online' | 'in_person';
  consultationDuration?: number;
  offersApplied?: string[];
  appointmentInfo: {
    startAt: Date;
    action: 'booked' | 'rescheduled' | 'cancelled';
    notes?: string;
    symptoms?: string[];
  }[];
};

export type RescheduleAppointmentInput = {
  newStartAt: Date;
  reason: string;
  symptoms?: string[];
  rescheduleCategory?: 'patient_request' | 'doctor_unavailable' | 'emergency' | 'technical_issue' | 'other';
  rescheduledByRole?: 'user' | 'doctor' | 'lab' | 'admin';
  rescheduledById?: string;
  notifyPatient?: boolean;
  notifyDoctor?: boolean;
};

export type CancelAppointmentInput = {
  reason: string;
  cancellationCategory?: 'patient_cancelled' | 'doctor_cancelled' | 'medical_emergency' | 'duplicate_booking' | 'payment_failed' | 'other';
  requestRefund?: boolean;
  notifyPatient?: boolean;
  notifyDoctor?: boolean;
};
