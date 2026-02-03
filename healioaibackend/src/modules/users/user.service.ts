import { AppError } from '../../common/errors/app-error';
import { ErrorCode } from '../../common/errors/error-codes';
import { HTTP_STATUS } from '../../common/constants';
import { PaginatedResult } from '../../common/pagination/pagination';
import { UserRepository } from './user.repository';
import { IUser } from './user.model';
import { CreateUserInput, UpdateUserInput, OnboardUserInput, LoginUserInput } from './user.validation';
import { v4 as uuidv4 } from 'uuid';
import * as admin from 'firebase-admin';

export class UserService {
  private readonly userRepository = new UserRepository();

  async login(data: LoginUserInput): Promise<IUser> {
    // 1. Verify Firebase Token
    try {
      const decodedToken = await admin.auth().verifyIdToken(data.idToken);
      if (decodedToken.uid !== data.firebaseUid) {
        throw new AppError(ErrorCode.UNAUTHORIZED, HTTP_STATUS.UNAUTHORIZED, 'Invalid token: UID mismatch');
      }
    } catch (error) {
      throw new AppError(ErrorCode.UNAUTHORIZED, HTTP_STATUS.UNAUTHORIZED, 'Invalid authentication token');
    }

    // 2. Find User by Firebase UID
    const existingUser = await this.userRepository.findByFirebaseUid(data.firebaseUid);
    
    if (!existingUser) {
       throw new AppError(ErrorCode.NOT_FOUND, HTTP_STATUS.NOT_FOUND, 'User account not found');
    }

    if (!existingUser.isActive) {
      throw new AppError(ErrorCode.FORBIDDEN, HTTP_STATUS.FORBIDDEN, 'User account is inactive');
    }

    // Populate refs for the return
    const populatedUser = await this.userRepository.findActiveByIdWithRefs(existingUser._id.toString());
    if (!populatedUser) {
        throw new AppError(ErrorCode.NOT_FOUND, HTTP_STATUS.NOT_FOUND, 'User account not found');
    }

    return populatedUser;
  }

  async onboard(data: OnboardUserInput, actorId?: string): Promise<IUser> {
    const exists = await this.userRepository.existsByPhoneNumber(data.phone.number);
    if (exists) {
      throw new AppError(
        ErrorCode.CONFLICT,
        HTTP_STATUS.CONFLICT,
        'User with this phone number already exists'
      );
    }
    if (data.email?.trim()) {
      const emailExists = await this.userRepository.existsByEmail(data.email.trim());
      if (emailExists) {
        throw new AppError(
          ErrorCode.CONFLICT,
          HTTP_STATUS.CONFLICT,
          'User with this email address already exists'
        );
      }
    }
    const payload = {
      ...data,
      email: data.email?.trim() ? data.email.trim().toLowerCase() : undefined,
      consents: {
        ...data.consents,
        acceptedAt: new Date(),
      },
      subscriptionStatus: 'active' as const,
      createdBy: actorId || uuidv4(),
      updatedBy: actorId || uuidv4(),
    };
    return this.userRepository.create(payload as unknown as Partial<IUser>);
  }

  async create(data: CreateUserInput, actorId?: string): Promise<IUser> {
    const exists = await this.userRepository.existsByPhoneNumber(data.phone.number);
    if (exists) {
      throw new AppError(
        ErrorCode.CONFLICT,
        HTTP_STATUS.CONFLICT,
        'User with this phone number already exists'
      );
    }
    if (data.email?.trim()) {
      const emailExists = await this.userRepository.existsByEmail(data.email.trim());
      if (emailExists) {
        throw new AppError(
          ErrorCode.CONFLICT,
          HTTP_STATUS.CONFLICT,
          'User with this email address already exists'
        );
      }
    }
    const payload = {
      ...data,
      email: data.email?.trim() ? data.email.trim().toLowerCase() : undefined,
      consents: {
        ...data.consents,
        acceptedAt: new Date(),
      },
      subscriptionStatus: 'active' as const,
      createdBy: actorId || uuidv4(),
      updatedBy: actorId || uuidv4(),
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

  async update(id: string, data: UpdateUserInput, actorId?: string): Promise<IUser> {
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
    const emailToSet =
      data.email !== undefined
        ? (data.email?.trim() ? data.email.trim().toLowerCase() : undefined)
        : undefined;
    if (data.email !== undefined && emailToSet !== user.email) {
      if (emailToSet) {
        const emailExists = await this.userRepository.existsByEmail(emailToSet);
        if (emailExists) {
          throw new AppError(
            ErrorCode.CONFLICT,
            HTTP_STATUS.CONFLICT,
            'User with this email address already exists'
          );
        }
      }
    }
    const updatePayload: any = { ...data };
    if (data.email !== undefined) updatePayload.email = emailToSet;
    updatePayload.updatedBy = actorId || uuidv4();
    const updated = await this.userRepository.updateById(id, { $set: updatePayload });
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
