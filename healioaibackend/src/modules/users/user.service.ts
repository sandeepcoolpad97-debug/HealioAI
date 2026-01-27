import { AppError } from '../../common/errors/app-error';
import { ErrorCode } from '../../common/errors/error-codes';
import { HTTP_STATUS } from '../../common/constants';
import { PaginatedResult } from '../../common/pagination/pagination';
import { UserRepository } from './user.repository';
import { IUser } from './user.model';
import { CreateUserInput, UpdateUserInput } from './user.validation';

export class UserService {
  private readonly userRepository = new UserRepository();

  async create(data: CreateUserInput): Promise<IUser> {
    const exists = await this.userRepository.existsByEmail(data.email);
    if (exists) {
      throw new AppError(
        ErrorCode.CONFLICT,
        HTTP_STATUS.CONFLICT,
        'User with this email already exists'
      );
    }
    return this.userRepository.create(data as Partial<IUser>);
  }

  async getById(id: string): Promise<IUser> {
    const user = await this.userRepository.findById(id);
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
    return this.userRepository.findPaginated({}, page, limit);
  }

  async update(id: string, data: UpdateUserInput): Promise<IUser> {
    const user = await this.getById(id);
    if (data.email && data.email !== user.email) {
      const exists = await this.userRepository.existsByEmail(data.email);
      if (exists) {
        throw new AppError(
          ErrorCode.CONFLICT,
          HTTP_STATUS.CONFLICT,
          'User with this email already exists'
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
