import { Request, Response, NextFunction } from 'express';
import { AuthenticatedRequest } from '../../common/middlewares/auth.middleware';
import { PaymentService } from './payment.service';
import {
  createPaymentSchema,
  updatePaymentStatusSchema,
  initiateRefundSchema,
  paymentIdParamSchema,
  listPaymentsQuerySchema,
} from './payment.validation';
import { validateBody, validateParams, validateQuery } from '../../common/validation/validate';
import { HTTP_STATUS } from '../../common/constants';

const paymentService = new PaymentService();

export async function createPayment(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const authReq = req as AuthenticatedRequest;
    // Ensure the payment is created for the authenticated user unless admin
    // For now, we trust the body, or we could enforce req.body.userId = authReq.userId
    if (!req.body.userId && authReq.userId) {
        req.body.userId = authReq.userId;
    }
    
    const payment = await paymentService.create(req.body);
    res.status(HTTP_STATUS.CREATED).json({ success: true, data: payment });
  } catch (err) {
    next(err);
  }
}

export async function getPaymentById(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const payment = await paymentService.getById(req.params.id);
    res.status(HTTP_STATUS.OK).json({ success: true, data: payment });
  } catch (err) {
    next(err);
  }
}

export async function listPayments(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const page = Number(req.query.page) || 1;
    const limit = Number(req.query.limit) || 20;
    const filters = {
        userId: req.query.userId,
        status: req.query.status,
        startDate: req.query.startDate,
        endDate: req.query.endDate,
        provider: req.query.provider,
    };
    const result = await paymentService.list(page, limit, filters);
    res.status(HTTP_STATUS.OK).json({ success: true, ...result });
  } catch (err) {
    next(err);
  }
}

export async function updatePaymentStatus(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const payment = await paymentService.updateStatus(req.params.id, req.body);
    res.status(HTTP_STATUS.OK).json({ success: true, data: payment });
  } catch (err) {
    next(err);
  }
}

export async function initiateRefund(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const payment = await paymentService.initiateRefund(req.params.id, req.body);
    res.status(HTTP_STATUS.OK).json({ success: true, data: payment });
  } catch (err) {
    next(err);
  }
}

export const createPaymentValidation = [validateBody(createPaymentSchema)];
export const getPaymentByIdValidation = [validateParams(paymentIdParamSchema)];
export const listPaymentsValidation = [validateQuery(listPaymentsQuerySchema)];
export const updatePaymentStatusValidation = [
  validateParams(paymentIdParamSchema),
  validateBody(updatePaymentStatusSchema),
];
export const initiateRefundValidation = [
  validateParams(paymentIdParamSchema),
  validateBody(initiateRefundSchema),
];
