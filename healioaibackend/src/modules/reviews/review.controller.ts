import { Request, Response, NextFunction } from 'express';
import { AuthenticatedRequest } from '../../common/middlewares/auth.middleware';
import { ReviewService } from './review.service';
import {
    createReviewSchema,
    updateReviewSchema,
    reviewIdParamSchema,
    listReviewsQuerySchema,
} from './review.validation';
import { validateBody, validateParams, validateQuery } from '../../common/validation/validate';
import { HTTP_STATUS } from '../../common/constants';

const reviewService = new ReviewService();

export async function createReview(
    req: Request,
    res: Response,
    next: NextFunction
): Promise<void> {
    try {
        const authReq = req as AuthenticatedRequest;
        const review = await reviewService.create(req.body, authReq.userId);
        res.status(HTTP_STATUS.CREATED).json({ success: true, data: review });
    } catch (err) {
        next(err);
    }
}

export async function getReviewById(
    req: Request,
    res: Response,
    next: NextFunction
): Promise<void> {
    try {
        const review = await reviewService.getById(req.params.id);
        res.status(HTTP_STATUS.OK).json({ success: true, data: review });
    } catch (err) {
        next(err);
    }
}

export async function listReviews(
    req: Request,
    res: Response,
    next: NextFunction
): Promise<void> {
    try {
        const page = Number(req.query.page) || 1;
        const limit = Number(req.query.limit) || 20;
        const filters = {
            reviewFor: req.query.reviewFor as 'Clinic' | 'Lab' | undefined,
            reviewForId: req.query.reviewForId as string | undefined,
            userId: req.query.userId as string | undefined,
        };
        const result = await reviewService.list(page, limit, filters);
        res.status(HTTP_STATUS.OK).json({ success: true, ...result });
    } catch (err) {
        next(err);
    }
}

export async function updateReview(
    req: Request,
    res: Response,
    next: NextFunction
): Promise<void> {
    try {
        const authReq = req as AuthenticatedRequest;
        const review = await reviewService.update(req.params.id, req.body, authReq.userId);
        res.status(HTTP_STATUS.OK).json({ success: true, data: review });
    } catch (err) {
        next(err);
    }
}

export async function deleteReview(
    req: Request,
    res: Response,
    next: NextFunction
): Promise<void> {
    try {
        await reviewService.delete(req.params.id);
        res.status(HTTP_STATUS.NO_CONTENT).send();
    } catch (err) {
        next(err);
    }
}

export const createReviewValidation = [validateBody(createReviewSchema)];
export const getReviewByIdValidation = [validateParams(reviewIdParamSchema)];
export const listReviewsValidation = [validateQuery(listReviewsQuerySchema)];
export const updateReviewValidation = [
    validateParams(reviewIdParamSchema),
    validateBody(updateReviewSchema),
];
export const deleteReviewValidation = [validateParams(reviewIdParamSchema)];
