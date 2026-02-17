import { FilterQuery } from 'mongoose';
import { BaseRepository } from '../../common/repository/base.repository';
import { getPaginationParams, paginated, PaginatedResult } from '../../common/pagination/pagination';
import { SupportTicketHistoryModel, ISupportTicketHistory } from './supportTicketHistory.model';

const HISTORY_REF_POPULATE = [
    { path: 'ticketId', select: 'ticketId subject status' },
    { path: 'performedById', select: 'name email clinicName labName emailId' },
    {
        path: 'attachments',
        select:
            'publicId url secureUrl resourceType format bytes width height folder originalFilename tags context',
    },
];

export class SupportTicketHistoryRepository extends BaseRepository<ISupportTicketHistory> {
    constructor() {
        super(SupportTicketHistoryModel);
    }

    async findByTicketId(ticketId: string): Promise<ISupportTicketHistory[]> {
        return this.model
            .find({ ticketId, isDeleted: false } as FilterQuery<ISupportTicketHistory>)
            .populate(HISTORY_REF_POPULATE[1])
            .populate(HISTORY_REF_POPULATE[2])
            .sort({ createdAt: 1 }) // Chronological order
            .exec();
    }

    async findByTicketIdPaginated(
        ticketId: string,
        page: number,
        limit: number
    ): Promise<PaginatedResult<ISupportTicketHistory>> {
        const params = getPaginationParams(page, limit);
        const filter = { ticketId, isDeleted: false } as FilterQuery<ISupportTicketHistory>;

        const [data, total] = await Promise.all([
            this.model
                .find(filter)
                .populate(HISTORY_REF_POPULATE[1])
                .populate(HISTORY_REF_POPULATE[2])
                .sort({ createdAt: 1 })
                .skip(params.skip)
                .limit(params.limit)
                .exec(),
            this.model.countDocuments(filter).exec(),
        ]);

        return paginated(data as ISupportTicketHistory[], total, params);
    }

    async findByAction(action: string): Promise<ISupportTicketHistory[]> {
        return this.model
            .find({ action, isDeleted: false } as FilterQuery<ISupportTicketHistory>)
            .sort({ createdAt: -1 })
            .exec();
    }

    async findPaginatedWithRefs(
        filter: FilterQuery<ISupportTicketHistory>,
        page: number,
        limit: number
    ): Promise<PaginatedResult<ISupportTicketHistory>> {
        const params = getPaginationParams(page, limit);
        const [data, total] = await Promise.all([
            this.model
                .find(filter)
                .populate(HISTORY_REF_POPULATE[0])
                .populate(HISTORY_REF_POPULATE[1])
                .populate(HISTORY_REF_POPULATE[2])
                .sort({ createdAt: -1 })
                .skip(params.skip)
                .limit(params.limit)
                .exec(),
            this.model.countDocuments(filter).exec(),
        ]);
        return paginated(data as ISupportTicketHistory[], total, params);
    }
}
