import { AppError } from '../../common/errors/app-error';
import { ErrorCode } from '../../common/errors/error-codes';
import { HTTP_STATUS } from '../../common/constants';
import { PaginatedResult } from '../../common/pagination/pagination';
import { LabRepository } from './lab.repository';
import { ILab } from './Lab.model';
import { CreateLabInput, UpdateLabInput } from './lab.validation';
import { v4 as uuidv4 } from 'uuid';

export class LabService {
  private readonly labRepository = new LabRepository();

  async create(data: CreateLabInput, actorId?: string): Promise<ILab> {
    const existsReg = await this.labRepository.existsByRegistrationNumber(data.registrationNumber);
    if (existsReg) {
      throw new AppError(
        ErrorCode.CONFLICT,
        HTTP_STATUS.CONFLICT,
        'Lab with this registration number already exists'
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
