import Joi from 'joi';
import { paginationQuerySchema } from '../../common/pagination/pagination';

export const createPaymentSchema = Joi.object({
  userId: Joi.string().hex().length(24).required(),
  paymentFor: Joi.object({
    serviceId: Joi.string().hex().length(24).required(),
    refId: Joi.string().hex().length(24).required(),
  }).required(),
  provider: Joi.string().valid('razorpay', 'stripe', 'cash').required(),
  paidVia: Joi.string().valid('razorpay', 'stripe', 'cash', 'upi', 'card').required(),
  transactionId: Joi.string().trim().optional(),
  orderId: Joi.string().trim().optional(),
  currency: Joi.string().default('INR'),
  paymentSummary: Joi.object({
    serviceFee: Joi.number().min(0).required(),
    discount: Joi.number().min(0).default(0),
    sgst: Joi.number().min(0).default(0),
    cgst: Joi.number().min(0).default(0),
    totalPayable: Joi.number().min(0).required(),
  }).required(),
  paymentStatus: Joi.string().valid('pending', 'paid', 'failed').default('pending'),
  paidAt: Joi.date().iso().optional(),
});

export const updatePaymentStatusSchema = Joi.object({
  paymentStatus: Joi.string().valid('paid', 'failed').required(),
  transactionId: Joi.string().trim().optional(),
  failureReason: Joi.object({
    code: Joi.string().trim().optional(),
    message: Joi.string().trim().optional(),
    source: Joi.string().trim().optional(),
  }).optional(),
});

export const initiateRefundSchema = Joi.object({
  amount: Joi.number().min(1).required(),
  reason: Joi.string().trim().required(),
});

export const paymentIdParamSchema = Joi.object({
  id: Joi.string().hex().length(24).required(),
});

export const listPaymentsQuerySchema = paginationQuerySchema.keys({
  userId: Joi.string().hex().length(24).optional(),
  status: Joi.string().valid('pending', 'paid', 'failed', 'refund_initiated', 'refunded', 'partial_refunded').optional(),
  startDate: Joi.date().iso().optional(),
  endDate: Joi.date().iso().optional(),
  provider: Joi.string().valid('razorpay', 'stripe', 'cash').optional(),
});

export type CreatePaymentInput = {
  userId: string;
  paymentFor: {
    serviceId: string;
    refId: string;
  };
  provider: 'razorpay' | 'stripe' | 'cash';
  paidVia: 'razorpay' | 'stripe' | 'cash' | 'upi' | 'card';
  transactionId?: string;
  orderId?: string;
  currency?: string;
  paymentSummary: {
    serviceFee: number;
    discount?: number;
    sgst?: number;
    cgst?: number;
    totalPayable: number;
  };
  paymentStatus?: 'pending' | 'paid' | 'failed';
  paidAt?: Date | string;
};

export type UpdatePaymentStatusInput = {
  paymentStatus: 'paid' | 'failed';
  transactionId?: string;
  failureReason?: {
    code?: string;
    message?: string;
    source?: string;
  };
};

export type InitiateRefundInput = {
  amount: number;
  reason: string;
};
