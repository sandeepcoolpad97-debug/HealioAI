import { AppError } from '../../common/errors/app-error';
import { ErrorCode } from '../../common/errors/error-codes';
import { HTTP_STATUS } from '../../common/constants';
import { PaginatedResult } from '../../common/pagination/pagination';
import { SubscriptionRepository } from './subscription.repository';
import { ISubscription } from './subscription.model';
import { CreateSubscriptionInput, UpdateSubscriptionInput } from './subscription.validation';
import { v4 as uuidv4 } from 'uuid';

export class SubscriptionService {
  private readonly subscriptionRepository = new SubscriptionRepository();

  async create(data: CreateSubscriptionInput, actorId?: string): Promise<ISubscription> {
    const exists = await this.subscriptionRepository.existsByCode(data.code);
    if (exists) {
      throw new AppError(
        ErrorCode.CONFLICT,
        HTTP_STATUS.CONFLICT,
        'Subscription with this code already exists'
      );
    }
    const payload = {
      ...data,
      createdBy: actorId || uuidv4(),
      updatedBy: actorId || uuidv4(),
    };
    return this.subscriptionRepository.create(payload as Partial<ISubscription>);
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

  async update(id: string, data: UpdateSubscriptionInput, actorId?: string): Promise<ISubscription> {
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
    const updatePayload: Partial<ISubscription> = { ...data };
    updatePayload.updatedBy = actorId || uuidv4();
    const updated = await this.subscriptionRepository.updateById(id, { $set: updatePayload });
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
