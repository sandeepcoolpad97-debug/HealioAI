import { FilterQuery } from 'mongoose';
import { BaseRepository } from '../../common/repository/base.repository';
import { NotificationTypeModel, INotificationType } from './notificationType.model';

export class NotificationTypeRepository extends BaseRepository<INotificationType> {
    constructor() {
        super(NotificationTypeModel);
    }

    async findByKey(key: string): Promise<INotificationType | null> {
        return this.model.findOne({ key, isDeleted: false });
    }

    async existsByKey(key: string): Promise<boolean> {
        const count = await this.model.countDocuments({ key, isDeleted: false });
        return count > 0;
    }

    async findActiveById(id: string): Promise<INotificationType | null> {
        return this.findOne({
            _id: id,
            isDeleted: false,
        } as FilterQuery<INotificationType>);
    }

    async findByPriority(priority: number): Promise<INotificationType[]> {
        return this.model.find({ priority, isDeleted: false });
    }
}
