import { AppError } from '../../common/errors/app-error';
import { ErrorCode } from '../../common/errors/error-codes';
import { HTTP_STATUS } from '../../common/constants';
import { PaginatedResult } from '../../common/pagination/pagination';
import { NotificationRepository } from './notification.repository';
import { INotification } from './notification.model';
import { CreateNotificationInput, BulkMarkAsReadInput } from './notification.validation';
import { v4 as uuidv4 } from 'uuid';
import { FilterQuery } from 'mongoose';

export class NotificationService {
    private readonly notificationRepository = new NotificationRepository();

    async create(data: CreateNotificationInput, actorId?: string): Promise<INotification> {
        const payload = {
            ...data,
            channels: {
                inApp: data.channels?.inApp ?? true,
                push: data.channels?.push ?? true,
                sms: data.channels?.sms ?? false,
            },
            createdBy: actorId || uuidv4(),
            updatedBy: actorId || uuidv4(),
        };

        return this.notificationRepository.create(payload as any);
    }

    async getById(id: string): Promise<INotification> {
        const notification = await this.notificationRepository.findActiveByIdWithRefs(id);
        if (!notification) {
            throw new AppError(
                ErrorCode.NOT_FOUND,
                HTTP_STATUS.NOT_FOUND,
                'Notification not found'
            );
        }
        return notification;
    }

    async list(
        page: number,
        limit: number,
        filters?: { userId?: string; isRead?: boolean; refType?: string; refId?: string }
    ): Promise<PaginatedResult<INotification>> {
        const query: FilterQuery<INotification> = { isDeleted: false };

        if (filters?.userId) {
            query.userId = filters.userId;
        }
        if (filters?.isRead !== undefined) {
            query.isRead = filters.isRead;
        }
        if (filters?.refType) {
            query['reference.refType'] = filters.refType;
        }
        if (filters?.refId) {
            query['reference.refId'] = filters.refId;
        }

        return this.notificationRepository.findPaginatedWithRefs(query, page, limit);
    }

    async markAsRead(id: string, userId?: string): Promise<INotification> {
        const notification = await this.notificationRepository.findActiveById(id);
        if (!notification) {
            throw new AppError(
                ErrorCode.NOT_FOUND,
                HTTP_STATUS.NOT_FOUND,
                'Notification not found'
            );
        }

        // Verify the notification belongs to the user if userId is provided
        if (userId && notification.userId.toString() !== userId) {
            throw new AppError(
                ErrorCode.FORBIDDEN,
                HTTP_STATUS.FORBIDDEN,
                'You do not have permission to mark this notification as read'
            );
        }

        const updated = await this.notificationRepository.markAsRead(id);
        if (!updated) {
            throw new AppError(
                ErrorCode.INTERNAL_ERROR,
                HTTP_STATUS.INTERNAL_SERVER_ERROR,
                'Failed to mark notification as read'
            );
        }
        return updated;
    }

    async bulkMarkAsRead(userId: string, data: BulkMarkAsReadInput): Promise<{ modifiedCount: number }> {
        const modifiedCount = await this.notificationRepository.bulkMarkAsRead(userId, data.notificationIds);
        return { modifiedCount };
    }

    async getUnreadCount(userId: string): Promise<{ count: number }> {
        const count = await this.notificationRepository.countUnreadByUserId(userId);
        return { count };
    }

    async delete(id: string): Promise<void> {
        const notification = await this.notificationRepository.findActiveById(id);
        if (!notification) {
            throw new AppError(
                ErrorCode.NOT_FOUND,
                HTTP_STATUS.NOT_FOUND,
                'Notification not found'
            );
        }

        // Soft delete
        await this.notificationRepository.updateById(id, { isDeleted: true });
    }
}
