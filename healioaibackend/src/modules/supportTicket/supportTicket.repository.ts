import { FilterQuery } from 'mongoose';
import { BaseRepository } from '../../common/repository/base.repository';
import { getPaginationParams, paginated, PaginatedResult } from '../../common/pagination/pagination';
import { SupportTicketModel, ISupportTicket } from './supportTicket.model';

const SUPPORT_TICKET_REF_POPULATE = [
    { path: 'raisedById', select: 'name email phone clinicName' },
    { path: 'assignedToId', select: 'name email' },
];

export class SupportTicketRepository extends BaseRepository<ISupportTicket> {
    constructor() {
        super(SupportTicketModel);
    }

    async generateTicketId(): Promise<string> {
        // Find the latest ticket to get the highest number
        const latestTicket = await this.model
            .findOne({}, { ticketId: 1 })
            .sort({ ticketId: -1 })
            .exec();

        let nextNumber = 10000; // Start from SUP-10000
        if (latestTicket && latestTicket.ticketId) {
            const currentNumber = parseInt(latestTicket.ticketId.replace('SUP-', ''), 10);
            nextNumber = currentNumber + 1;
        }

        return `SUP-${nextNumber.toString().padStart(5, '0')}`;
    }

    async findByTicketId(ticketId: string): Promise<ISupportTicket | null> {
        return this.model.findOne({ ticketId, isDeleted: false } as FilterQuery<ISupportTicket>).exec();
    }

    async findByRaisedBy(raisedById: string, raisedByRole: string): Promise<ISupportTicket[]> {
        return this.model
            .find({ raisedById, raisedByRole, isDeleted: false } as FilterQuery<ISupportTicket>)
            .sort({ lastUpdatedAt: -1 })
            .exec();
    }

    async findByAssignee(assignedToId: string): Promise<ISupportTicket[]> {
        return this.model
            .find({ assignedToId, isDeleted: false } as FilterQuery<ISupportTicket>)
            .sort({ lastUpdatedAt: -1 })
            .exec();
    }

    async findByStatus(status: string): Promise<ISupportTicket[]> {
        return this.model
            .find({ status, isDeleted: false } as FilterQuery<ISupportTicket>)
            .sort({ lastUpdatedAt: -1 })
            .exec();
    }

    async findActiveById(id: string): Promise<ISupportTicket | null> {
        return this.findOne({
            _id: id,
            isDeleted: false,
        } as FilterQuery<ISupportTicket>);
    }

    async findActiveByIdWithRefs(id: string): Promise<ISupportTicket | null> {
        const filter = {
            _id: id,
            isDeleted: false,
        } as FilterQuery<ISupportTicket>;
        return this.model
            .findOne(filter)
            .populate(SUPPORT_TICKET_REF_POPULATE[0])
            .populate(SUPPORT_TICKET_REF_POPULATE[1])
            .exec() as Promise<ISupportTicket | null>;
    }

    async findPaginatedWithRefs(
        filter: FilterQuery<ISupportTicket>,
        page: number,
        limit: number
    ): Promise<PaginatedResult<ISupportTicket>> {
        const params = getPaginationParams(page, limit);
        const [data, total] = await Promise.all([
            this.model
                .find(filter)
                .populate(SUPPORT_TICKET_REF_POPULATE[0])
                .populate(SUPPORT_TICKET_REF_POPULATE[1])
                .sort({ lastUpdatedAt: -1 })
                .skip(params.skip)
                .limit(params.limit)
                .exec(),
            this.model.countDocuments(filter).exec(),
        ]);
        return paginated(data as ISupportTicket[], total, params);
    }
}
