import { AppError } from '../../common/errors/app-error';
import { ErrorCode } from '../../common/errors/error-codes';
import { HTTP_STATUS } from '../../common/constants';
import { PaginatedResult } from '../../common/pagination/pagination';
import { UserRepository } from './user.repository';
import { IUser } from './user.model';
import { CreateUserInput, UpdateUserInput, OnboardUserInput } from './user.validation';

export class UserService {
  private readonly userRepository = new UserRepository();

  async onboard(data: OnboardUserInput): Promise<IUser> {
    const exists = await this.userRepository.existsByPhoneNumber(data.phone.number);
    if (exists) {
      throw new AppError(
        ErrorCode.CONFLICT,
        HTTP_STATUS.CONFLICT,
        'User with this phone number already exists'
      );
    }
    const payload = {
      ...data,
      consents: {
        ...data.consents,
        acceptedAt: new Date(),
      },
      subscriptionStatus: 'active' as const,
    };
    return this.userRepository.create(payload as unknown as Partial<IUser>);
  }

  async create(data: CreateUserInput): Promise<IUser> {
    const exists = await this.userRepository.existsByPhoneNumber(data.phone.number);
    if (exists) {
      throw new AppError(
        ErrorCode.CONFLICT,
        HTTP_STATUS.CONFLICT,
        'User with this phone number already exists'
      );
    }
    const payload = {
      ...data,
      consents: {
        ...data.consents,
        acceptedAt: new Date(),
      },
      subscriptionStatus: 'active' as const,
    };
    return this.userRepository.create(payload as unknown as Partial<IUser>);
  }

  async getById(id: string): Promise<IUser> {
    const user = await this.userRepository.findActiveByIdWithRefs(id);
    if (!user) {
      throw new AppError(
        ErrorCode.NOT_FOUND,
        HTTP_STATUS.NOT_FOUND,
        'User not found'
      );
    }
    return user;
  }

  async list(page: number, limit: number): Promise<PaginatedResult<IUser>> {
    return this.userRepository.findPaginatedWithRefs({ isDeleted: false }, page, limit);
  }

  async update(id: string, data: UpdateUserInput): Promise<IUser> {
    const user = await this.getById(id);
    if (data.phone?.number && data.phone.number !== user.phone?.number) {
      const exists = await this.userRepository.existsByPhoneNumber(data.phone.number);
      if (exists) {
        throw new AppError(
          ErrorCode.CONFLICT,
          HTTP_STATUS.CONFLICT,
          'User with this phone number already exists'
        );
      }
    }
    const updated = await this.userRepository.updateById(id, { $set: data });
    if (!updated) {
      throw new AppError(
        ErrorCode.NOT_FOUND,
        HTTP_STATUS.NOT_FOUND,
        'User not found'
      );
    }
    return updated;
  }

  async delete(id: string): Promise<void> {
    const deleted = await this.userRepository.deleteById(id);
    if (!deleted) {
      throw new AppError(
        ErrorCode.NOT_FOUND,
        HTTP_STATUS.NOT_FOUND,
        'User not found'
      );
    }
  }
}
