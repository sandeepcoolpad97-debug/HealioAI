import { AppError } from '../../common/errors/app-error';
import { ErrorCode } from '../../common/errors/error-codes';
import { HTTP_STATUS } from '../../common/constants';
import { PaginatedResult } from '../../common/pagination/pagination';
import { NotificationTypeRepository } from './notificationType.repository';
import { INotificationType } from './notificationType.model';
import { CreateNotificationTypeInput, UpdateNotificationTypeInput } from './notificationType.validation';
import { FilterQuery } from 'mongoose';
import { v4 as uuidv4 } from 'uuid';

export class NotificationTypeService {
    private readonly notificationTypeRepository = new NotificationTypeRepository();

    async create(data: CreateNotificationTypeInput, actorId?: string): Promise<INotificationType> {
        // Check if key already exists
        const existingType = await this.notificationTypeRepository.findByKey(data.key);
        if (existingType) {
            throw new AppError(
                ErrorCode.CONFLICT,
                HTTP_STATUS.CONFLICT,
                `Notification type with key '${data.key}' already exists`
            );
        }

        const payload = {
            ...data,
            defaultChannels: {
                inApp: data.defaultChannels?.inApp ?? true,
                push: data.defaultChannels?.push ?? true,
                sms: data.defaultChannels?.sms ?? false,
            },
            createdBy: actorId || uuidv4(),
            updatedBy: actorId || uuidv4(),
        };

        return this.notificationTypeRepository.create(payload);
    }

    async getById(id: string): Promise<INotificationType> {
        const notificationType = await this.notificationTypeRepository.findActiveById(id);
        if (!notificationType) {
            throw new AppError(
                ErrorCode.NOT_FOUND,
                HTTP_STATUS.NOT_FOUND,
                'Notification type not found'
            );
        }
        return notificationType;
    }

    async getByKey(key: string): Promise<INotificationType> {
        const notificationType = await this.notificationTypeRepository.findByKey(key);
        if (!notificationType) {
            throw new AppError(
                ErrorCode.NOT_FOUND,
                HTTP_STATUS.NOT_FOUND,
                `Notification type with key '${key}' not found`
            );
        }
        return notificationType;
    }

    async list(
        page: number,
        limit: number,
        filters: { search?: string; priority?: number }
    ): Promise<PaginatedResult<INotificationType>> {
        const query: FilterQuery<INotificationType> = { isDeleted: false };

        if (filters.priority !== undefined) {
            query.priority = filters.priority;
        }

        if (filters.search) {
            query.$or = [
                { key: { $regex: filters.search, $options: 'i' } },
                { titleTemplate: { $regex: filters.search, $options: 'i' } },
                { messageTemplate: { $regex: filters.search, $options: 'i' } },
            ];
        }

        return this.notificationTypeRepository.findPaginated(query, page, limit);
    }

    async update(
        id: string,
        data: UpdateNotificationTypeInput,
        actorId?: string
    ): Promise<INotificationType> {
        const notificationType = await this.notificationTypeRepository.findActiveById(id);
        if (!notificationType) {
            throw new AppError(
                ErrorCode.NOT_FOUND,
                HTTP_STATUS.NOT_FOUND,
                'Notification type not found'
            );
        }

        // Check if key is being updated and if it conflicts with another record
        if (data.key && data.key !== notificationType.key) {
            const existingType = await this.notificationTypeRepository.findByKey(data.key);
            if (existingType) {
                throw new AppError(
                    ErrorCode.CONFLICT,
                    HTTP_STATUS.CONFLICT,
                    `Notification type with key '${data.key}' already exists`
                );
            }
        }

        const updatePayload = {
            ...data,
            updatedBy: actorId || uuidv4(),
        };

        const updated = await this.notificationTypeRepository.updateById(id, updatePayload);
        if (!updated) {
            throw new AppError(
                ErrorCode.INTERNAL_ERROR,
                HTTP_STATUS.INTERNAL_SERVER_ERROR,
                'Failed to update notification type'
            );
        }
        return updated;
    }

    async delete(id: string): Promise<void> {
        const notificationType = await this.notificationTypeRepository.findActiveById(id);
        if (!notificationType) {
            throw new AppError(
                ErrorCode.NOT_FOUND,
                HTTP_STATUS.NOT_FOUND,
                'Notification type not found'
            );
        }

        // Soft delete
        await this.notificationTypeRepository.updateById(id, { isDeleted: true });
    }
}
