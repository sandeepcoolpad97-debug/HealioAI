import { AppError } from '../../common/errors/app-error';
import { ErrorCode } from '../../common/errors/error-codes';
import { HTTP_STATUS } from '../../common/constants';
import { PaginatedResult } from '../../common/pagination/pagination';
import { LabRepository } from './lab.repository';
import { ILab } from './Lab.model';
import { CreateLabInput, UpdateLabInput, LoginLabInput } from './lab.validation';
import { v4 as uuidv4 } from 'uuid';
import * as admin from 'firebase-admin';

export class LabService {
  private readonly labRepository = new LabRepository();

  async login(data: LoginLabInput): Promise<ILab> {
    // 1. Verify Firebase Token
    try {
      const decodedToken = await admin.auth().verifyIdToken(data.idToken);
      if (decodedToken.uid !== data.firebaseUid) {
        throw new AppError(ErrorCode.UNAUTHORIZED, HTTP_STATUS.UNAUTHORIZED, 'Invalid token: UID mismatch');
      }
    } catch (error) {
      throw new AppError(ErrorCode.UNAUTHORIZED, HTTP_STATUS.UNAUTHORIZED, 'Invalid authentication token');
    }

    // 2. Find Lab by Firebase UID
    const existingLab = await this.labRepository.findByFirebaseUid(data.firebaseUid);
    
    if (!existingLab) {
       throw new AppError(ErrorCode.NOT_FOUND, HTTP_STATUS.NOT_FOUND, 'Lab account not found');
    }

    if (!existingLab.isActive) {
      throw new AppError(ErrorCode.FORBIDDEN, HTTP_STATUS.FORBIDDEN, 'Lab account is inactive');
    }

    // Populate refs for the return
    const populatedLab = await this.labRepository.findActiveByIdWithRefs(existingLab._id.toString());
    if (!populatedLab) {
        throw new AppError(ErrorCode.NOT_FOUND, HTTP_STATUS.NOT_FOUND, 'Lab account not found');
    }

    return populatedLab;
  }

  async create(data: CreateLabInput, actorId?: string): Promise<ILab> {
    const existsReg = await this.labRepository.existsByRegistrationNumber(data.registrationNumber);
    if (existsReg) {
      throw new AppError(
        ErrorCode.CONFLICT,
        HTTP_STATUS.CONFLICT,
        'Lab with this registration number already exists'
      );
    }
    const existsPhone = await this.labRepository.existsByPhoneNumber(data.phone.number);
    if (existsPhone) {
      throw new AppError(
        ErrorCode.CONFLICT,
        HTTP_STATUS.CONFLICT,
        'Lab with this phone number already exists'
      );
    }
    if (data.emailId?.trim()) {
      const existsEmail = await this.labRepository.existsByEmailId(data.emailId.trim());
      if (existsEmail) {
        throw new AppError(
          ErrorCode.CONFLICT,
          HTTP_STATUS.CONFLICT,
          'Lab with this email already exists'
        );
      }
    }
    const payload = {
      ...data,
      emailId: data.emailId?.trim() ? data.emailId.trim().toLowerCase() : undefined,
      consents: data.consents
        ? { ...data.consents, acceptedAt: new Date() }
        : undefined,
      createdBy: actorId || uuidv4(),
      updatedBy: actorId || uuidv4(),
    };
    return this.labRepository.create(payload as unknown as Partial<ILab>);
  }

  async getById(id: string): Promise<ILab> {
    const lab = await this.labRepository.findActiveByIdWithRefs(id);
    if (!lab) {
      throw new AppError(
        ErrorCode.NOT_FOUND,
        HTTP_STATUS.NOT_FOUND,
        'Lab not found'
      );
    }
    return lab;
  }

  async list(page: number, limit: number): Promise<PaginatedResult<ILab>> {
    return this.labRepository.findPaginatedWithRefs(
      { isDeleted: false },
      page,
      limit
    );
  }

  async update(id: string, data: UpdateLabInput, actorId?: string): Promise<ILab> {
    const lab = await this.getById(id);
    if (
      data.registrationNumber &&
      data.registrationNumber.trim() !== lab.registrationNumber
    ) {
      const exists = await this.labRepository.existsByRegistrationNumber(
        data.registrationNumber.trim()
      );
      if (exists) {
        throw new AppError(
          ErrorCode.CONFLICT,
          HTTP_STATUS.CONFLICT,
          'Lab with this registration number already exists'
        );
      }
    }
    if (
      data.phone?.number &&
      data.phone.number.trim() !== lab.phone.number
    ) {
      const exists = await this.labRepository.existsByPhoneNumber(
        data.phone.number.trim()
      );
      if (exists) {
        throw new AppError(
          ErrorCode.CONFLICT,
          HTTP_STATUS.CONFLICT,
          'Lab with this phone number already exists'
        );
      }
    }
    const emailToSet =
      data.emailId !== undefined
        ? (data.emailId?.trim() ? data.emailId.trim().toLowerCase() : undefined)
        : undefined;
    if (data.emailId !== undefined && emailToSet !== lab.emailId) {
      if (emailToSet) {
        const existsEmail = await this.labRepository.existsByEmailId(emailToSet);
        if (existsEmail) {
          throw new AppError(
            ErrorCode.CONFLICT,
            HTTP_STATUS.CONFLICT,
            'Lab with this email already exists'
          );
        }
      }
    }
    const updatePayload = { ...data };
    if (data.emailId !== undefined) updatePayload.emailId = emailToSet;
    if (actorId) updatePayload.updatedBy = actorId;
    
    const updated = await this.labRepository.updateById(id, { $set: updatePayload });
    if (!updated) {
      throw new AppError(
        ErrorCode.NOT_FOUND,
        HTTP_STATUS.NOT_FOUND,
        'Lab not found'
      );
    }
    return updated;
  }

  async delete(id: string): Promise<void> {
    const lab = await this.labRepository.findById(id);
    if (!lab) {
      throw new AppError(
        ErrorCode.NOT_FOUND,
        HTTP_STATUS.NOT_FOUND,
        'Lab not found'
      );
    }
    const deleted = await this.labRepository.deleteById(id);
    if (!deleted) {
      throw new AppError(
        ErrorCode.NOT_FOUND,
        HTTP_STATUS.NOT_FOUND,
        'Lab not found'
      );
    }
  }
}
