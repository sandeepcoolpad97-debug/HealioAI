import { AppError } from '../../common/errors/app-error';
import { ErrorCode } from '../../common/errors/error-codes';
import { HTTP_STATUS } from '../../common/constants';
import { PaginatedResult } from '../../common/pagination/pagination';
import { SubscriptionRepository } from './subscription.repository';
import { ISubscription } from './subscription.model';
import { CreateSubscriptionInput, UpdateSubscriptionInput } from './subscription.validation';

export class SubscriptionService {
  private readonly subscriptionRepository = new SubscriptionRepository();

  async create(data: CreateSubscriptionInput): Promise<ISubscription> {
    const exists = await this.subscriptionRepository.existsByCode(data.code);
    if (exists) {
      throw new AppError(
        ErrorCode.CONFLICT,
        HTTP_STATUS.CONFLICT,
        'Subscription with this code already exists'
      );
    }
    return this.subscriptionRepository.create(data as Partial<ISubscription>);
  }

  async getById(id: string): Promise<ISubscription> {
    const subscription = await this.subscriptionRepository.findActiveById(id);
    if (!subscription) {
      throw new AppError(
        ErrorCode.NOT_FOUND,
        HTTP_STATUS.NOT_FOUND,
        'Subscription not found'
      );
    }
    return subscription;
  }

  async list(page: number, limit: number): Promise<PaginatedResult<ISubscription>> {
    return this.subscriptionRepository.findPaginated({ isDeleted: false }, page, limit);
  }

  async update(id: string, data: UpdateSubscriptionInput): Promise<ISubscription> {
    const subscription = await this.getById(id);
    if (data.code && data.code !== subscription.code) {
      const exists = await this.subscriptionRepository.existsByCode(data.code);
      if (exists) {
        throw new AppError(
          ErrorCode.CONFLICT,
          HTTP_STATUS.CONFLICT,
          'Subscription with this code already exists'
        );
      }
    }
    if (subscription.isSystemPlan && data.isSystemPlan === false) {
      throw new AppError(
        ErrorCode.BAD_REQUEST,
        HTTP_STATUS.BAD_REQUEST,
        'Cannot unset system plan flag on a system plan'
      );
    }
    const updated = await this.subscriptionRepository.updateById(id, { $set: data });
    if (!updated) {
      throw new AppError(
        ErrorCode.NOT_FOUND,
        HTTP_STATUS.NOT_FOUND,
        'Subscription not found'
      );
    }
    return updated;
  }

  async delete(id: string): Promise<void> {
    const subscription = await this.subscriptionRepository.findById(id);
    if (!subscription) {
      throw new AppError(
        ErrorCode.NOT_FOUND,
        HTTP_STATUS.NOT_FOUND,
        'Subscription not found'
      );
    }
    if (subscription.isSystemPlan) {
      throw new AppError(
        ErrorCode.BAD_REQUEST,
        HTTP_STATUS.BAD_REQUEST,
        'Cannot delete a system plan'
      );
    }
    const deleted = await this.subscriptionRepository.deleteById(id);
    if (!deleted) {
      throw new AppError(
        ErrorCode.NOT_FOUND,
        HTTP_STATUS.NOT_FOUND,
        'Subscription not found'
      );
    }
  }
}
