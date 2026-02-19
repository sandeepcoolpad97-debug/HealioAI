import { PaginatedResult } from '../../common/pagination/pagination';
import { SupportTicketHistoryRepository } from './supportTicketHistory.repository';
import { ISupportTicketHistory } from './supportTicketHistory.model';
import { CreateHistoryEntryInput } from './supportTicketHistory.validation';
import { v4 as uuidv4 } from 'uuid';
import { FilterQuery } from 'mongoose';

export class SupportTicketHistoryService {
    private readonly historyRepository = new SupportTicketHistoryRepository();

    async create(data: CreateHistoryEntryInput, actorId?: string): Promise<ISupportTicketHistory> {
        const payload = {
            ...data,
            createdBy: actorId || uuidv4(),
            updatedBy: actorId || uuidv4(),
        };

        return this.historyRepository.create(payload as any);
    }

    async getByTicketId(ticketId: string): Promise<ISupportTicketHistory[]> {
        return this.historyRepository.findByTicketId(ticketId);
    }

    async getByTicketIdPaginated(
        ticketId: string,
        page: number,
        limit: number
    ): Promise<PaginatedResult<ISupportTicketHistory>> {
        return this.historyRepository.findByTicketIdPaginated(ticketId, page, limit);
    }

    async list(
        page: number,
        limit: number,
        filters?: {
            ticketId?: string;
            action?: string;
            performedByRole?: string;
        }
    ): Promise<PaginatedResult<ISupportTicketHistory>> {
        const query: FilterQuery<ISupportTicketHistory> = { isDeleted: false };

        if (filters?.ticketId) query.ticketId = filters.ticketId;
        if (filters?.action) query.action = filters.action;
        if (filters?.performedByRole) query.performedByRole = filters.performedByRole;

        return this.historyRepository.findPaginatedWithRefs(query, page, limit);
    }

    // Helper method for creating system-generated entries
    async createSystemEntry(
        ticketId: string,
        action: CreateHistoryEntryInput['action'],
        message: string,
        oldValue?: any,
        newValue?: any
    ): Promise<ISupportTicketHistory> {
        return this.create({
            ticketId,
            action,
            message,
            oldValue,
            newValue,
            performedByRole: 'System',
            performedById: null,
        });
    }
}
