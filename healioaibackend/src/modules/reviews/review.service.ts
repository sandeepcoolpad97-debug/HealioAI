import { AppError } from '../../common/errors/app-error';
import { ErrorCode } from '../../common/errors/error-codes';
import { HTTP_STATUS } from '../../common/constants';
import { PaginatedResult } from '../../common/pagination/pagination';
import { ReviewRepository } from './review.repository';
import { IReview } from './review.model';
import { CreateReviewInput, UpdateReviewInput } from './review.validation';
import { v4 as uuidv4 } from 'uuid';
import { AppointmentRepository } from '../appointment/appointment.repository';

export class ReviewService {
    private readonly reviewRepository = new ReviewRepository();
    private readonly appointmentRepository = new AppointmentRepository();

    async create(data: CreateReviewInput, actorId?: string): Promise<IReview> {
        // Check if review already exists for this appointment
        const exists = await this.reviewRepository.existsByAppointmentId(data.appointmentId);
        if (exists) {
            throw new AppError(
                ErrorCode.CONFLICT,
                HTTP_STATUS.CONFLICT,
                'A review already exists for this appointment'
            );
        }

        const payload = {
            ...data,
            createdBy: actorId || uuidv4(),
            updatedBy: actorId || uuidv4(),
        };

        const review = await this.reviewRepository.create(payload as unknown as Partial<IReview>);

        // Update appointment to set isReviewAdded = true
        if (review && data.appointmentId) {
            await this.appointmentRepository.updateById(data.appointmentId, {
                $set: { isReviewAdded: true }
            });
        }

        return review;
    }

    async getById(id: string): Promise<IReview> {
        const review = await this.reviewRepository.findActiveByIdWithRefs(id);
        if (!review) {
            throw new AppError(
                ErrorCode.NOT_FOUND,
                HTTP_STATUS.NOT_FOUND,
                'Review not found'
            );
        }
        return review;
    }

    async list(
        page: number,
        limit: number,
        filters?: { reviewFor?: 'Clinic' | 'Lab'; reviewForId?: string; userId?: string }
    ): Promise<PaginatedResult<IReview>> {
        const query: any = { isDeleted: false };
        if (filters?.reviewFor) query.reviewFor = filters.reviewFor;
        if (filters?.reviewForId) query.reviewForId = filters.reviewForId;
        if (filters?.userId) query.userId = filters.userId;
        return this.reviewRepository.findPaginatedWithRefs(query, page, limit);
    }

    async update(id: string, data: UpdateReviewInput, actorId?: string): Promise<IReview> {
        await this.getById(id); // ensure exists
        const updatePayload: any = { ...data };
        updatePayload.updatedBy = actorId || uuidv4();
        const updated = await this.reviewRepository.updateById(id, { $set: updatePayload });
        if (!updated) {
            throw new AppError(
                ErrorCode.NOT_FOUND,
                HTTP_STATUS.NOT_FOUND,
                'Review not found'
            );
        }
        return updated;
    }

    async delete(id: string): Promise<void> {
        const deleted = await this.reviewRepository.deleteById(id);
        if (!deleted) {
            throw new AppError(
                ErrorCode.NOT_FOUND,
                HTTP_STATUS.NOT_FOUND,
                'Review not found'
            );
        }
    }
}
