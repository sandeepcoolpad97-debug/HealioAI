import { ServiceRepository } from './service.repository';
import { IService } from './service.model';
import { AppError } from '../../common/errors/app-error';
import { ErrorCode } from '../../common/errors/error-codes';
import { HTTP_STATUS } from '../../common/constants';
import { PaginatedResult } from '../../common/pagination/pagination';

export interface CreateServiceInput {
  name: string;
  code: string;
  description?: string;
  createdBy: string;
}

export interface UpdateServiceInput {
  name?: string;
  code?: string;
  description?: string;
  isActive?: boolean;
  updatedBy: string;
}

export class ServiceService {
  private serviceRepository: ServiceRepository;

  constructor() {
    this.serviceRepository = new ServiceRepository();
  }

  async create(data: CreateServiceInput): Promise<IService> {
    const exists = await this.serviceRepository.existsByCode(data.code);
    if (exists) {
      throw new AppError(
        ErrorCode.CONFLICT,
        HTTP_STATUS.CONFLICT,
        `Service with code ${data.code} already exists`
      );
    }

    return this.serviceRepository.create(data);
  }

  async list(page: number, limit: number, filters: { isActive?: boolean; search?: string }): Promise<PaginatedResult<IService>> {
    const query: any = { isDeleted: false };

    if (filters.isActive !== undefined) {
      query.isActive = filters.isActive;
    }

    if (filters.search) {
      query.$or = [
        { name: { $regex: filters.search, $options: 'i' } },
        { code: { $regex: filters.search, $options: 'i' } },
      ];
    }

    return this.serviceRepository.findPaginated(query, page, limit);
  }

  async getById(id: string): Promise<IService> {
    const service = await this.serviceRepository.findById(id);
    if (!service) {
      throw new AppError(
        ErrorCode.NOT_FOUND,
        HTTP_STATUS.NOT_FOUND,
        'Service not found'
      );
    }
    return service;
  }

  async update(id: string, data: UpdateServiceInput): Promise<IService> {
    const service = await this.serviceRepository.findById(id);
    if (!service) {
      throw new AppError(
        ErrorCode.NOT_FOUND,
        HTTP_STATUS.NOT_FOUND,
        'Service not found'
      );
    }

    if (data.code && data.code !== service.code) {
      const exists = await this.serviceRepository.existsByCode(data.code, id);
      if (exists) {
        throw new AppError(
          ErrorCode.CONFLICT,
          HTTP_STATUS.CONFLICT,
          `Service with code ${data.code} already exists`
        );
      }
    }

    const updated = await this.serviceRepository.updateById(id, data);
    if (!updated) {
      throw new AppError(
        ErrorCode.INTERNAL_ERROR,
        HTTP_STATUS.INTERNAL_SERVER_ERROR,
        'Failed to update service'
      );
    }

    return updated;
  }

  async delete(id: string, deletedBy: string): Promise<void> {
    const service = await this.serviceRepository.findById(id);
    if (!service) {
      throw new AppError(
        ErrorCode.NOT_FOUND,
        HTTP_STATUS.NOT_FOUND,
        'Service not found'
      );
    }

    // Soft delete implementation using updateById
    await this.serviceRepository.updateById(id, {
      isDeleted: true,
      isActive: false,
      // @ts-ignore - deletedBy is part of IAuditFields but TS might complain if not in UpdateQuery explicitly or handled by plugin
      deletedBy: deletedBy,
      deletedAt: new Date()
    } as any);
  }
}
