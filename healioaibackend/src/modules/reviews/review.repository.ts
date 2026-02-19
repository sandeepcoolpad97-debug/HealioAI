import { FilterQuery } from 'mongoose';
import { BaseRepository } from '../../common/repository/base.repository';
import { getPaginationParams, paginated, PaginatedResult } from '../../common/pagination/pagination';
import { ReviewModel, IReview } from './review.model';

const REVIEW_REF_POPULATE = [
    { path: 'appointmentId', select: 'appointmentDate status appointmentId currentStartAt' },
    { path: 'userId', select: 'name email phone' },
    { path: 'reviewForId', select: 'clinicName doctorName name registrationNumber specialisation' },
];

export class ReviewRepository extends BaseRepository<IReview> {
    constructor() {
        super(ReviewModel);
    }

    async findByAppointmentId(appointmentId: string): Promise<IReview | null> {
        return this.findOne({ appointmentId } as FilterQuery<IReview>);
    }

    async existsByAppointmentId(appointmentId: string): Promise<boolean> {
        const count = await this.count({ appointmentId } as FilterQuery<IReview>);
        return count > 0;
    }

    async findActiveById(id: string): Promise<IReview | null> {
        return this.findOne({
            _id: id,
            isDeleted: false,
            isActive: true,
        } as FilterQuery<IReview>);
    }

    async findActiveByIdWithRefs(id: string): Promise<IReview | null> {
        const filter = {
            _id: id,
            isDeleted: false,
        } as FilterQuery<IReview>;
        return this.model
            .findOne(filter)
            .populate(REVIEW_REF_POPULATE[0])
            .populate(REVIEW_REF_POPULATE[1])
            .populate(REVIEW_REF_POPULATE[2])
            .exec() as Promise<IReview | null>;
    }

    async findPaginatedWithRefs(
        filter: FilterQuery<IReview>,
        page: number,
        limit: number
    ): Promise<PaginatedResult<IReview>> {
        const params = getPaginationParams(page, limit);
        const [data, total] = await Promise.all([
            this.model
                .find(filter)
                .populate(REVIEW_REF_POPULATE[0])
                .populate(REVIEW_REF_POPULATE[1])
                .populate(REVIEW_REF_POPULATE[2])
                .sort({ createdAt: -1 })
                .skip(params.skip)
                .limit(params.limit)
                .exec(),
            this.model.countDocuments(filter).exec(),
        ]);
        return paginated(data as IReview[], total, params);
    }

    async findByReviewTarget(
        reviewFor: 'Clinic' | 'Lab',
        reviewForId: string,
        page: number,
        limit: number
    ): Promise<PaginatedResult<IReview>> {
        const filter = {
            reviewFor,
            reviewForId,
            isDeleted: false,
        } as FilterQuery<IReview>;
        return this.findPaginatedWithRefs(filter, page, limit);
    }
}
