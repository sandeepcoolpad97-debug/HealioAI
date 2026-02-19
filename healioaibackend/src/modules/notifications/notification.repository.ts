import { FilterQuery } from 'mongoose';
import { BaseRepository } from '../../common/repository/base.repository';
import { getPaginationParams, paginated, PaginatedResult } from '../../common/pagination/pagination';
import { NotificationModel, INotification } from './notification.model';

const NOTIFICATION_REF_POPULATE = [
    { path: 'userId', select: 'name email phone' },
    { path: 'typeId', select: 'key titleTemplate messageTemplate icon priority' },
];

export class NotificationRepository extends BaseRepository<INotification> {
    constructor() {
        super(NotificationModel);
    }

    async findByUserId(userId: string): Promise<INotification[]> {
        return this.model
            .find({ userId, isDeleted: false } as FilterQuery<INotification>)
            .sort({ createdAt: -1 })
            .exec();
    }

    async findUnreadByUserId(userId: string): Promise<INotification[]> {
        return this.model
            .find({ userId, isRead: false, isDeleted: false } as FilterQuery<INotification>)
            .sort({ createdAt: -1 })
            .exec();
    }

    async countUnreadByUserId(userId: string): Promise<number> {
        return this.model.countDocuments({ userId, isRead: false, isDeleted: false } as FilterQuery<INotification>);
    }

    async markAsRead(id: string): Promise<INotification | null> {
        return this.model.findByIdAndUpdate(
            id,
            { $set: { isRead: true, readAt: new Date() } },
            { new: true }
        ).exec();
    }

    async bulkMarkAsRead(userId: string, notificationIds: string[]): Promise<number> {
        const result = await this.model.updateMany(
            { _id: { $in: notificationIds }, userId, isDeleted: false } as FilterQuery<INotification>,
            { $set: { isRead: true, readAt: new Date() } }
        ).exec();
        return result.modifiedCount;
    }

    async findActiveById(id: string): Promise<INotification | null> {
        return this.findOne({
            _id: id,
            isDeleted: false,
        } as FilterQuery<INotification>);
    }

    async findActiveByIdWithRefs(id: string): Promise<INotification | null> {
        const filter = {
            _id: id,
            isDeleted: false,
        } as FilterQuery<INotification>;
        return this.model
            .findOne(filter)
            .populate(NOTIFICATION_REF_POPULATE[0])
            .populate(NOTIFICATION_REF_POPULATE[1])
            .exec() as Promise<INotification | null>;
    }

    async findPaginatedWithRefs(
        filter: FilterQuery<INotification>,
        page: number,
        limit: number
    ): Promise<PaginatedResult<INotification>> {
        const params = getPaginationParams(page, limit);
        const [data, total] = await Promise.all([
            this.model
                .find(filter)
                .populate(NOTIFICATION_REF_POPULATE[0])
                .populate(NOTIFICATION_REF_POPULATE[1])
                .sort({ createdAt: -1 })
                .skip(params.skip)
                .limit(params.limit)
                .exec(),
            this.model.countDocuments(filter).exec(),
        ]);
        return paginated(data as INotification[], total, params);
    }
}
