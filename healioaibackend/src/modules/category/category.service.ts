import { AppError } from '../../common/errors/app-error';
import { ErrorCode } from '../../common/errors/error-codes';
import { HTTP_STATUS } from '../../common/constants';
import { PaginatedResult } from '../../common/pagination/pagination';
import { CategoryRepository } from './category.repository';
import { ICategory } from './category.model';
import { CreateCategoryInput, UpdateCategoryInput } from './category.validation';
import { FilterQuery } from 'mongoose';
import { v4 as uuidv4 } from 'uuid';

export class CategoryService {
  private readonly categoryRepository = new CategoryRepository();

  async create(data: CreateCategoryInput, actorId?: string): Promise<ICategory> {
    const exists = await this.categoryRepository.existsByCode(data.code);
    if (exists) {
      throw new AppError(
        ErrorCode.CONFLICT,
        HTTP_STATUS.CONFLICT,
        `Category with code '${data.code}' already exists`
      );
    }

    const payload = {
      ...data,
      createdBy: actorId || uuidv4(),
      updatedBy: actorId || uuidv4(),
    };

    return this.categoryRepository.create(payload);
  }

  async getById(id: string): Promise<ICategory> {
    const category = await this.categoryRepository.findActiveById(id);
    if (!category) {
      throw new AppError(
        ErrorCode.NOT_FOUND,
        HTTP_STATUS.NOT_FOUND,
        'Category not found'
      );
    }
    return category;
  }

  async list(page: number, limit: number, filters: { isActive?: boolean; search?: string }): Promise<PaginatedResult<ICategory>> {
    const query: FilterQuery<ICategory> = { isDeleted: false };

    if (filters.isActive !== undefined) {
      query.isActive = filters.isActive;
    }

    if (filters.search) {
      query.$or = [
        { name: { $regex: filters.search, $options: 'i' } },
        { code: { $regex: filters.search, $options: 'i' } },
      ];
    }

    return this.categoryRepository.findPaginated(query, page, limit);
  }

  async update(id: string, data: UpdateCategoryInput, actorId?: string): Promise<ICategory> {
    const category = await this.categoryRepository.findActiveById(id);
    if (!category) {
      throw new AppError(
        ErrorCode.NOT_FOUND,
        HTTP_STATUS.NOT_FOUND,
        'Category not found'
      );
    }

    if (data.code && data.code !== category.code) {
      const exists = await this.categoryRepository.existsByCode(data.code);
      if (exists) {
        throw new AppError(
          ErrorCode.CONFLICT,
          HTTP_STATUS.CONFLICT,
          `Category with code '${data.code}' already exists`
        );
      }
    }

    const updatePayload = {
      ...data,
      updatedBy: actorId || uuidv4(),
    };

    const updated = await this.categoryRepository.updateById(id, updatePayload);
    if (!updated) {
        throw new AppError(
            ErrorCode.INTERNAL_ERROR,
            HTTP_STATUS.INTERNAL_SERVER_ERROR,
            'Failed to update category'
        );
    }
    return updated;
  }

  async delete(id: string): Promise<void> {
    // Check if exists
    const category = await this.categoryRepository.findActiveById(id);
    if (!category) {
      throw new AppError(
        ErrorCode.NOT_FOUND,
        HTTP_STATUS.NOT_FOUND,
        'Category not found'
      );
    }
    
    // Soft delete if isDeleted is supported by schema (via auditPlugin)
    // BaseRepository has deleteById (hard delete)
    // But auditPlugin adds isDeleted.
    // BaseRepository might not have softDelete method explicitly shown in the snippet I read.
    // I only read findById, findOne, find, findPaginated, create, updateById, deleteById, count.
    // deleteById in BaseRepository uses findByIdAndDelete (hard delete).
    // If I want soft delete, I should use updateById setting isDeleted: true.
    
    await this.categoryRepository.updateById(id, { isDeleted: true, isActive: false });
  }
}
