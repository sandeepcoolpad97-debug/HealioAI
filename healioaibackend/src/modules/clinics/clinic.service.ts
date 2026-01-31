import { AppError } from '../../common/errors/app-error';
import { ErrorCode } from '../../common/errors/error-codes';
import { HTTP_STATUS } from '../../common/constants';
import { PaginatedResult } from '../../common/pagination/pagination';
import { ClinicRepository } from './clinic.repository';
import { IClinic } from './clinic.model';
import { CreateClinicInput, UpdateClinicInput } from './clinic.validation';
import { v4 as uuidv4 } from 'uuid';

export class ClinicService {
  private readonly clinicRepository = new ClinicRepository();

  async create(data: CreateClinicInput, actorId?: string): Promise<IClinic> {
    const existsReg = await this.clinicRepository.existsByRegistrationNumber(data.registrationNumber);
    if (existsReg) {
      throw new AppError(
        ErrorCode.CONFLICT,
        HTTP_STATUS.CONFLICT,
        'Clinic with this registration number already exists'
      );
    }
    if (data.emailId?.trim()) {
      const existsEmail = await this.clinicRepository.existsByEmailId(data.emailId.trim());
      if (existsEmail) {
        throw new AppError(
          ErrorCode.CONFLICT,
          HTTP_STATUS.CONFLICT,
          'Clinic with this email already exists'
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
    return this.clinicRepository.create(payload as unknown as Partial<IClinic>);
  }

  async getById(id: string): Promise<IClinic> {
    const clinic = await this.clinicRepository.findActiveByIdWithRefs(id);
    if (!clinic) {
      throw new AppError(
        ErrorCode.NOT_FOUND,
        HTTP_STATUS.NOT_FOUND,
        'Clinic not found'
      );
    }
    return clinic;
  }

  async list(page: number, limit: number): Promise<PaginatedResult<IClinic>> {
    return this.clinicRepository.findPaginatedWithRefs(
      { isDeleted: false },
      page,
      limit
    );
  }

  async update(id: string, data: UpdateClinicInput, actorId?: string): Promise<IClinic> {
    const clinic = await this.getById(id);
    if (
      data.registrationNumber &&
      data.registrationNumber.trim() !== clinic.registrationNumber
    ) {
      const exists = await this.clinicRepository.existsByRegistrationNumber(
        data.registrationNumber.trim()
      );
      if (exists) {
        throw new AppError(
          ErrorCode.CONFLICT,
          HTTP_STATUS.CONFLICT,
          'Clinic with this registration number already exists'
        );
      }
    }
    const emailToSet =
      data.emailId !== undefined
        ? (data.emailId?.trim() ? data.emailId.trim().toLowerCase() : undefined)
        : undefined;
    if (data.emailId !== undefined && emailToSet !== clinic.emailId) {
      if (emailToSet) {
        const existsEmail = await this.clinicRepository.existsByEmailId(emailToSet);
        if (existsEmail) {
          throw new AppError(
            ErrorCode.CONFLICT,
            HTTP_STATUS.CONFLICT,
            'Clinic with this email already exists'
          );
        }
      }
    }
    const updatePayload = { ...data };
    if (data.emailId !== undefined) updatePayload.emailId = emailToSet;
    if (actorId) updatePayload.updatedBy = actorId;
    const updated = await this.clinicRepository.updateById(id, { $set: updatePayload });
    if (!updated) {
      throw new AppError(
        ErrorCode.NOT_FOUND,
        HTTP_STATUS.NOT_FOUND,
        'Clinic not found'
      );
    }
    return updated;
  }

  async delete(id: string): Promise<void> {
    const clinic = await this.clinicRepository.findById(id);
    if (!clinic) {
      throw new AppError(
        ErrorCode.NOT_FOUND,
        HTTP_STATUS.NOT_FOUND,
        'Clinic not found'
      );
    }
    const deleted = await this.clinicRepository.deleteById(id);
    if (!deleted) {
      throw new AppError(
        ErrorCode.NOT_FOUND,
        HTTP_STATUS.NOT_FOUND,
        'Clinic not found'
      );
    }
  }
}
