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
    // Unique code check is removed as requested
    // But we might want to check unique (code, type) combination if required, 
    // however user explicitly asked to remove unique for category code.
    // We will proceed without uniqueness check on code, or maybe we check uniqueness of name?
    // Let's assume name should be unique as per model (unique: true).
    
    // Check if name exists (since name is unique in model)
    // The model says name: { unique: true }
    // The repository doesn't have existByName, let's assume standard error handling catches duplicate key error.

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

  async list(page: number, limit: number, filters: { isActive?: boolean; search?: string; type?: string }): Promise<PaginatedResult<ICategory>> {
    const query: FilterQuery<ICategory> = { isDeleted: false };

    if (filters.isActive !== undefined) {
      query.isActive = filters.isActive;
    }

    if (filters.type) {
      // If type is 'both', we might want to fetch everything? 
      // Or if the category is marked as 'both', it should appear for both 'reschedule' and 'cancellation' queries?
      // User requirement: "fetch the detailes based on the query also".
      // Let's implement logic:
      // If query.type is provided (e.g. 'reschedule'), we want categories that are 'reschedule' OR 'both'.
      // If query.type is 'cancellation', we want 'cancellation' OR 'both'.
      // If query.type is 'both', we probably just want 'both'? Or all?
      // Usually "type" filter means exact match.
      // But if a category is "both", it applies to both.
      // So if I ask for "reschedule" categories, I should get "reschedule" AND "both".
      if (filters.type === 'reschedule' || filters.type === 'cancellation') {
          query.type = { $in: [filters.type, 'both'] };
      } else {
          // If filtering by 'both' or anything else, strict match
          query.type = filters.type;
      }
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

    // Code uniqueness check removed
    
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
