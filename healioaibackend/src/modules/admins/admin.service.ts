import { AppError } from '../../common/errors/app-error';
import { ErrorCode } from '../../common/errors/error-codes';
import { HTTP_STATUS } from '../../common/constants';
import { PaginatedResult } from '../../common/pagination/pagination';
import { AdminRepository } from './admin.repository';
import { IAdmin } from './admin.model';
import { CreateAdminInput, UpdateAdminInput, OnboardAdminInput, LoginAdminInput } from './admin.validation';
import { v4 as uuidv4 } from 'uuid';
import * as admin from 'firebase-admin';

export class AdminService {
  private readonly adminRepository = new AdminRepository();

  async login(data: LoginAdminInput): Promise<IAdmin> {
    // 1. Verify Firebase Token
    try {
      const decodedToken = await admin.auth().verifyIdToken(data.idToken);
      if (decodedToken.uid !== data.firebaseUid) {
        throw new AppError(ErrorCode.UNAUTHORIZED, HTTP_STATUS.UNAUTHORIZED, 'Invalid token: UID mismatch');
      }
    } catch (error) {
      throw new AppError(ErrorCode.UNAUTHORIZED, HTTP_STATUS.UNAUTHORIZED, 'Invalid authentication token');
    }

    // 2. Find Admin by Firebase UID
    const existingAdmin = await this.adminRepository.findByFirebaseUid(data.firebaseUid);
    
    if (!existingAdmin) {
       // Optional: Check by email if firebaseUid not yet linked (legacy support)
       const adminByEmail = await this.adminRepository.findByEmail(data.email);
       if (adminByEmail) {
         // Link them? Or just allow login?
         // For now, let's strictly require the UID to match or we throw not found.
         // If we want to support auto-linking, we'd do it here.
         // Let's throw specific error
         throw new AppError(ErrorCode.NOT_FOUND, HTTP_STATUS.NOT_FOUND, 'Admin account not found for this user');
       }
       throw new AppError(ErrorCode.NOT_FOUND, HTTP_STATUS.NOT_FOUND, 'Admin account not found');
    }

    if (!existingAdmin.isActive) {
      throw new AppError(ErrorCode.FORBIDDEN, HTTP_STATUS.FORBIDDEN, 'Admin account is inactive');
    }

    // Populate refs for the return
    const populatedAdmin = await this.adminRepository.findActiveByIdWithRefs(existingAdmin._id.toString());
    if (!populatedAdmin) {
        throw new AppError(ErrorCode.NOT_FOUND, HTTP_STATUS.NOT_FOUND, 'Admin account not found');
    }

    return populatedAdmin;
  }

  async onboard(data: OnboardAdminInput, actorId?: string): Promise<IAdmin> {
    const exists = await this.adminRepository.existsByPhoneNumber(data.phone.number);
    if (exists) {
      throw new AppError(
        ErrorCode.CONFLICT,
        HTTP_STATUS.CONFLICT,
        'Admin with this phone number already exists'
      );
    }
    const emailExists = await this.adminRepository.existsByEmail(data.email);
    if (emailExists) {
      throw new AppError(
        ErrorCode.CONFLICT,
        HTTP_STATUS.CONFLICT,
        'Admin with this email address already exists'
      );
    }
    const payload = {
      ...data,
      email: data.email.trim().toLowerCase(),
      consents: {
        ...data.consents,
        acceptedAt: new Date(),
      },
      createdBy: actorId || uuidv4(),
      updatedBy: actorId || uuidv4(),
    };
    return this.adminRepository.create(payload as unknown as Partial<IAdmin>);
  }

  async create(data: CreateAdminInput, actorId?: string): Promise<IAdmin> {
    const exists = await this.adminRepository.existsByPhoneNumber(data.phone.number);
    if (exists) {
      throw new AppError(
        ErrorCode.CONFLICT,
        HTTP_STATUS.CONFLICT,
        'Admin with this phone number already exists'
      );
    }
    const emailExists = await this.adminRepository.existsByEmail(data.email);
    if (emailExists) {
      throw new AppError(
        ErrorCode.CONFLICT,
        HTTP_STATUS.CONFLICT,
        'Admin with this email address already exists'
      );
    }
    const payload = {
      ...data,
      email: data.email.trim().toLowerCase(),
      consents: {
        ...data.consents,
        acceptedAt: new Date(),
      },
      createdBy: actorId || uuidv4(),
      updatedBy: actorId || uuidv4(),
    };
    return this.adminRepository.create(payload as unknown as Partial<IAdmin>);
  }

  async getById(id: string): Promise<IAdmin> {
    const admin = await this.adminRepository.findActiveByIdWithRefs(id);
    if (!admin) {
      throw new AppError(
        ErrorCode.NOT_FOUND,
        HTTP_STATUS.NOT_FOUND,
        'Admin not found'
      );
    }
    return admin;
  }

  async list(page: number, limit: number): Promise<PaginatedResult<IAdmin>> {
    return this.adminRepository.findPaginatedWithRefs({ isDeleted: false }, page, limit);
  }

  async update(id: string, data: UpdateAdminInput, actorId?: string): Promise<IAdmin> {
    const admin = await this.getById(id);
    
    if (data.phone?.number && data.phone.number !== admin.phone?.number) {
      const exists = await this.adminRepository.existsByPhoneNumber(data.phone.number);
      if (exists) {
        throw new AppError(
          ErrorCode.CONFLICT,
          HTTP_STATUS.CONFLICT,
          'Admin with this phone number already exists'
        );
      }
    }

    if (data.email && data.email.trim().toLowerCase() !== admin.email) {
      const emailExists = await this.adminRepository.existsByEmail(data.email.trim());
      if (emailExists) {
        throw new AppError(
          ErrorCode.CONFLICT,
          HTTP_STATUS.CONFLICT,
          'Admin with this email address already exists'
        );
      }
    }

    const updatePayload = {
      ...data,
      updatedBy: actorId || uuidv4(),
    };

    const updated = await this.adminRepository.updateById(id, { $set: updatePayload });
    if (!updated) {
      throw new AppError(
        ErrorCode.INTERNAL_ERROR,
        HTTP_STATUS.INTERNAL_SERVER_ERROR,
        'Failed to update admin'
      );
    }
    return updated;
  }

  async delete(id: string): Promise<void> {
    const updated = await this.adminRepository.updateById(id, { $set: { isDeleted: true } });
    if (!updated) {
      throw new AppError(
        ErrorCode.NOT_FOUND,
        HTTP_STATUS.NOT_FOUND,
        'Admin not found'
      );
    }
  }
}
