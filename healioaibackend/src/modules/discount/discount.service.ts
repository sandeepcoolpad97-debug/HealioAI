import mongoose from 'mongoose';
import { DiscountRepository } from './discount.repository';
import { ServiceRepository } from '../service/service.repository';
import { IDiscount } from './discount.model';
import { AppError } from '../../common/errors/app-error';
import { ErrorCode } from '../../common/errors/error-codes';
import { HTTP_STATUS } from '../../common/constants';
import { PaginatedResult } from '../../common/pagination/pagination';

export interface CreateDiscountInput {
  name: string;
  description?: string;
  price: number;
  serviceId: string;
  rule: Record<string, any>;
  createdBy: string;
}

export interface UpdateDiscountInput {
  name?: string;
  description?: string;
  price?: number;
  serviceId?: string;
  rule?: Record<string, any>;
  isActive?: boolean;
  updatedBy: string;
}

export class DiscountService {
  private discountRepository: DiscountRepository;
  private serviceRepository: ServiceRepository;

  constructor() {
    this.discountRepository = new DiscountRepository();
    this.serviceRepository = new ServiceRepository();
  }

  async create(data: CreateDiscountInput): Promise<IDiscount> {
    // Validate service exists
    const service = await this.serviceRepository.findById(data.serviceId);
    if (!service) {
      throw new AppError(
        ErrorCode.NOT_FOUND,
        HTTP_STATUS.NOT_FOUND,
        'Service not found'
      );
    }

    return this.discountRepository.create({
      ...data,
      serviceId: new mongoose.Types.ObjectId(data.serviceId)
    } as unknown as Partial<IDiscount>);
  }

  async list(page: number, limit: number, filters: { isActive?: boolean; search?: string; serviceId?: string }): Promise<PaginatedResult<IDiscount>> {
    const query: any = { isDeleted: false };

    if (filters.isActive !== undefined) {
      query.isActive = filters.isActive;
    }

    if (filters.serviceId) {
      query.serviceId = filters.serviceId;
    }

    if (filters.search) {
      query.name = { $regex: filters.search, $options: 'i' };
    }

    return this.discountRepository.findPaginatedWithService(query, page, limit);
  }

  async getById(id: string): Promise<IDiscount> {
    const discount = await this.discountRepository.findByIdWithService(id);
    if (!discount) {
      throw new AppError(
        ErrorCode.NOT_FOUND,
        HTTP_STATUS.NOT_FOUND,
        'Discount not found'
      );
    }
    return discount;
  }

  async update(id: string, data: UpdateDiscountInput): Promise<IDiscount> {
    const discount = await this.discountRepository.findById(id);
    if (!discount) {
      throw new AppError(
        ErrorCode.NOT_FOUND,
        HTTP_STATUS.NOT_FOUND,
        'Discount not found'
      );
    }

    const updateData: any = { ...data };

    // If updating serviceId, validate new service exists
    if (data.serviceId && data.serviceId !== discount.serviceId.toString()) {
      const service = await this.serviceRepository.findById(data.serviceId);
      if (!service) {
        throw new AppError(
          ErrorCode.NOT_FOUND,
          HTTP_STATUS.NOT_FOUND,
          'Service not found'
        );
      }
      updateData.serviceId = new mongoose.Types.ObjectId(data.serviceId);
    }

    const updated = await this.discountRepository.updateById(id, updateData);
    if (!updated) {
      throw new AppError(
        ErrorCode.INTERNAL_ERROR,
        HTTP_STATUS.INTERNAL_SERVER_ERROR,
        'Failed to update discount'
      );
    }

    return updated;
  }

  async delete(id: string, deletedBy: string): Promise<void> {
    const discount = await this.discountRepository.findById(id);
    if (!discount) {
      throw new AppError(
        ErrorCode.NOT_FOUND,
        HTTP_STATUS.NOT_FOUND,
        'Discount not found'
      );
    }

    await this.discountRepository.updateById(id, {
      isDeleted: true,
      isActive: false,
      // @ts-ignore
      deletedBy: deletedBy,
      deletedAt: new Date()
    } as any);
  }
}
