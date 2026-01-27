import { FilterQuery } from 'mongoose';
import { BaseRepository } from '../../common/repository/base.repository';
import { SubscriptionModel, ISubscription } from './subscription.model';

export class SubscriptionRepository extends BaseRepository<ISubscription> {
  constructor() {
    super(SubscriptionModel);
  }

  async findByCode(code: string): Promise<ISubscription | null> {
    return this.findOne({ code: code.toLowerCase() } as FilterQuery<ISubscription>);
  }

  async existsByCode(code: string): Promise<boolean> {
    const count = await this.count({ code: code.toLowerCase() } as FilterQuery<ISubscription>);
    return count > 0;
  }

  async findActiveById(id: string): Promise<ISubscription | null> {
    return this.findOne({
      _id: id,
      isDeleted: false,
      isActive: true,
    } as FilterQuery<ISubscription>);
  }
}
