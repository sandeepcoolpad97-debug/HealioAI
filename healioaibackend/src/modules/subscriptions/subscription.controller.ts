import { Request, Response, NextFunction } from 'express';
import { SubscriptionService } from './subscription.service';
import {
  createSubscriptionSchema,
  updateSubscriptionSchema,
  subscriptionIdParamSchema,
  listSubscriptionsQuerySchema,
} from './subscription.validation';
import { validateBody, validateParams, validateQuery } from '../../common/validation/validate';
import { HTTP_STATUS } from '../../common/constants';

const subscriptionService = new SubscriptionService();

export async function createSubscription(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const subscription = await subscriptionService.create(req.body);
    res.status(HTTP_STATUS.CREATED).json({ success: true, data: subscription });
  } catch (err) {
    next(err);
  }
}

export async function getSubscriptionById(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const subscription = await subscriptionService.getById(req.params.id);
    res.status(HTTP_STATUS.OK).json({ success: true, data: subscription });
  } catch (err) {
    next(err);
  }
}

export async function listSubscriptions(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const page = Number(req.query.page) || 1;
    const limit = Number(req.query.limit) || 20;
    const result = await subscriptionService.list(page, limit);
    res.status(HTTP_STATUS.OK).json({ success: true, ...result });
  } catch (err) {
    next(err);
  }
}

export async function updateSubscription(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const subscription = await subscriptionService.update(req.params.id, req.body);
    res.status(HTTP_STATUS.OK).json({ success: true, data: subscription });
  } catch (err) {
    next(err);
  }
}

export async function deleteSubscription(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    await subscriptionService.delete(req.params.id);
    res.status(HTTP_STATUS.NO_CONTENT).send();
  } catch (err) {
    next(err);
  }
}

export const createSubscriptionValidation = [validateBody(createSubscriptionSchema)];
export const getSubscriptionByIdValidation = [validateParams(subscriptionIdParamSchema)];
export const listSubscriptionsValidation = [validateQuery(listSubscriptionsQuerySchema)];
export const updateSubscriptionValidation = [
  validateParams(subscriptionIdParamSchema),
  validateBody(updateSubscriptionSchema),
];
export const deleteSubscriptionValidation = [validateParams(subscriptionIdParamSchema)];
