import { AppError } from '../../common/errors/app-error';
import { ErrorCode } from '../../common/errors/error-codes';
import { HTTP_STATUS } from '../../common/constants';
import { PaginatedResult } from '../../common/pagination/pagination';
import { SupportTicketRepository } from './supportTicket.repository';
import { ISupportTicket } from './supportTicket.model';
import {
    CreateSupportTicketInput,
    UpdateSupportTicketInput,
    UpdateStatusInput,
    AssignTicketInput,
    UpdatePriorityInput,
    AddReplyInput,
} from './supportTicket.validation';
import { v4 as uuidv4 } from 'uuid';
import { FilterQuery } from 'mongoose';
import { SupportTicketHistoryService } from '../supportTicketHistory';

export class SupportTicketService {
    private readonly supportTicketRepository = new SupportTicketRepository();
    private readonly historyService = new SupportTicketHistoryService();

    async create(data: CreateSupportTicketInput, actorId?: string): Promise<ISupportTicket> {
        // Generate unique ticket ID
        const ticketId = await this.supportTicketRepository.generateTicketId();

        const payload = {
            ...data,
            ticketId,
            lastUpdatedAt: new Date(),
            createdBy: actorId || uuidv4(),
            updatedBy: actorId || uuidv4(),
        };

        const ticket = await this.supportTicketRepository.create(payload as any);

        const ticketWithRefs =
            (await this.supportTicketRepository.findActiveByIdWithRefs(
                ticket._id.toString()
            )) || ticket;

        // Create initial history entry
        await this.historyService.create({
            ticketId: ticket._id.toString(),
            action: 'created',
            message: `Ticket created: ${data.subject}`,
            performedByRole: data.raisedByRole,
            performedById: data.raisedById,
        });

        return ticketWithRefs;
    }

    async getById(id: string): Promise<ISupportTicket> {
        const ticket = await this.supportTicketRepository.findActiveByIdWithRefs(id);
        if (!ticket) {
            throw new AppError(
                ErrorCode.NOT_FOUND,
                HTTP_STATUS.NOT_FOUND,
                'Support ticket not found'
            );
        }
        return ticket;
    }

    async getByTicketId(ticketId: string): Promise<ISupportTicket> {
        const ticket = await this.supportTicketRepository.findByTicketId(ticketId);
        if (!ticket) {
            throw new AppError(
                ErrorCode.NOT_FOUND,
                HTTP_STATUS.NOT_FOUND,
                `Support ticket ${ticketId} not found`
            );
        }
        return ticket;
    }

    async list(
        page: number,
        limit: number,
        filters?: {
            raisedById?: string;
            raisedByRole?: string;
            status?: string;
            priority?: string;
            assignedToId?: string;
            category?: string;
            search?: string;
        }
    ): Promise<PaginatedResult<ISupportTicket>> {
        const query: FilterQuery<ISupportTicket> = { isDeleted: false };

        if (filters?.raisedById) query.raisedById = filters.raisedById;
        if (filters?.raisedByRole) query.raisedByRole = filters.raisedByRole;
        if (filters?.status) query.status = filters.status;
        if (filters?.priority) query.priority = filters.priority;
        if (filters?.assignedToId) query.assignedToId = filters.assignedToId;
        if (filters?.category) query.category = filters.category;

        if (filters?.search) {
            query.$or = [
                { ticketId: { $regex: filters.search, $options: 'i' } },
                { subject: { $regex: filters.search, $options: 'i' } },
                { description: { $regex: filters.search, $options: 'i' } },
            ];
        }

        return this.supportTicketRepository.findPaginatedWithRefs(query, page, limit);
    }

    async update(
        id: string,
        data: UpdateSupportTicketInput,
        actorId?: string
    ): Promise<ISupportTicket> {
        const ticket = await this.supportTicketRepository.findActiveById(id);
        if (!ticket) {
            throw new AppError(
                ErrorCode.NOT_FOUND,
                HTTP_STATUS.NOT_FOUND,
                'Support ticket not found'
            );
        }

        const updatePayload = {
            ...data,
            lastUpdatedAt: new Date(),
            updatedBy: actorId || uuidv4(),
        };

        const updated = await this.supportTicketRepository.updateById(id, updatePayload);
        if (!updated) {
            throw new AppError(
                ErrorCode.INTERNAL_ERROR,
                HTTP_STATUS.INTERNAL_SERVER_ERROR,
                'Failed to update support ticket'
            );
        }

        // Create history entry for update
        await this.historyService.create({
            ticketId: id,
            action: 'category_changed',
            message: 'Ticket details updated',
            oldValue: { subject: ticket.subject, description: ticket.description },
            newValue: data,
            performedByRole: 'System',
            performedById: actorId,
        });

        const updatedWithRefs =
            (await this.supportTicketRepository.findActiveByIdWithRefs(id)) || updated;

        return updatedWithRefs;
    }

    async updateStatus(
        id: string,
        data: UpdateStatusInput,
        performedByRole: string,
        performedById: string,
        actorId?: string
    ): Promise<ISupportTicket> {
        const ticket = await this.supportTicketRepository.findActiveById(id);
        if (!ticket) {
            throw new AppError(
                ErrorCode.NOT_FOUND,
                HTTP_STATUS.NOT_FOUND,
                'Support ticket not found'
            );
        }

        const oldStatus = ticket.status;
        const updatePayload = {
            status: data.status,
            lastUpdatedAt: new Date(),
            updatedBy: actorId || uuidv4(),
        };

        const updated = await this.supportTicketRepository.updateById(id, updatePayload);
        if (!updated) {
            throw new AppError(
                ErrorCode.INTERNAL_ERROR,
                HTTP_STATUS.INTERNAL_SERVER_ERROR,
                'Failed to update ticket status'
            );
        }

        // Determine history action
        let action: any = 'status_changed';
        if (data.status === 'closed') action = 'closed';
        else if (oldStatus === 'closed' && data.status === 'open') action = 'reopened';

        // Create history entry
        await this.historyService.create({
            ticketId: id,
            action,
            message: `Status changed from ${oldStatus} to ${data.status}`,
            oldValue: { status: oldStatus },
            newValue: { status: data.status },
            performedByRole: performedByRole as any,
            performedById,
        });

        const updatedWithRefs =
            (await this.supportTicketRepository.findActiveByIdWithRefs(id)) || updated;

        return updatedWithRefs;
    }

    async assignTicket(
        id: string,
        data: AssignTicketInput,
        performedByRole: string,
        performedById: string,
        actorId?: string
    ): Promise<ISupportTicket> {
        const ticket = await this.supportTicketRepository.findActiveById(id);
        if (!ticket) {
            throw new AppError(
                ErrorCode.NOT_FOUND,
                HTTP_STATUS.NOT_FOUND,
                'Support ticket not found'
            );
        }

        const updatePayload = {
            assignedToRole: data.assignedToRole,
            assignedToId: data.assignedToId,
            status: 'in_progress', // Auto-update status when assigned
            lastUpdatedAt: new Date(),
            updatedBy: actorId || uuidv4(),
        };

        const updated = await this.supportTicketRepository.updateById(id, updatePayload);
        if (!updated) {
            throw new AppError(
                ErrorCode.INTERNAL_ERROR,
                HTTP_STATUS.INTERNAL_SERVER_ERROR,
                'Failed to assign ticket'
            );
        }

        // Create history entry
        await this.historyService.create({
            ticketId: id,
            action: 'assigned',
            message: `Ticket assigned to ${data.assignedToRole}`,
            newValue: { assignedToRole: data.assignedToRole, assignedToId: data.assignedToId },
            performedByRole: performedByRole as any,
            performedById,
        });

        const updatedWithRefs =
            (await this.supportTicketRepository.findActiveByIdWithRefs(id)) || updated;

        return updatedWithRefs;
    }

    async updatePriority(
        id: string,
        data: UpdatePriorityInput,
        performedByRole: string,
        performedById: string,
        actorId?: string
    ): Promise<ISupportTicket> {
        const ticket = await this.supportTicketRepository.findActiveById(id);
        if (!ticket) {
            throw new AppError(
                ErrorCode.NOT_FOUND,
                HTTP_STATUS.NOT_FOUND,
                'Support ticket not found'
            );
        }

        const oldPriority = ticket.priority;
        const updatePayload = {
            priority: data.priority,
            lastUpdatedAt: new Date(),
            updatedBy: actorId || uuidv4(),
        };

        const updated = await this.supportTicketRepository.updateById(id, updatePayload);
        if (!updated) {
            throw new AppError(
                ErrorCode.INTERNAL_ERROR,
                HTTP_STATUS.INTERNAL_SERVER_ERROR,
                'Failed to update priority'
            );
        }

        // Create history entry
        await this.historyService.create({
            ticketId: id,
            action: 'priority_changed',
            message: `Priority changed from ${oldPriority} to ${data.priority}`,
            oldValue: { priority: oldPriority },
            newValue: { priority: data.priority },
            performedByRole: performedByRole as any,
            performedById,
        });

        const updatedWithRefs =
            (await this.supportTicketRepository.findActiveByIdWithRefs(id)) || updated;

        return updatedWithRefs;
    }

    async addReply(id: string, data: AddReplyInput): Promise<void> {
        const ticket = await this.supportTicketRepository.findActiveById(id);
        if (!ticket) {
            throw new AppError(
                ErrorCode.NOT_FOUND,
                HTTP_STATUS.NOT_FOUND,
                'Support ticket not found'
            );
        }

        // Update lastUpdatedAt
        await this.supportTicketRepository.updateById(id, {
            lastUpdatedAt: new Date(),
        });

        // Determine action type based on role
        const action = ['Admin', 'SupportAgent'].includes(data.performedByRole)
            ? 'agent_reply'
            : 'user_reply';

        // Create history entry for reply
        await this.historyService.create({
            ticketId: id,
            action: action as any,
            message: data.message,
            performedByRole: data.performedByRole as any,
            performedById: data.performedById,
            attachments: data.attachments,
        });
    }

    async delete(id: string): Promise<void> {
        const ticket = await this.supportTicketRepository.findActiveById(id);
        if (!ticket) {
            throw new AppError(
                ErrorCode.NOT_FOUND,
                HTTP_STATUS.NOT_FOUND,
                'Support ticket not found'
            );
        }

        // Soft delete
        await this.supportTicketRepository.updateById(id, { isDeleted: true });
    }
}
