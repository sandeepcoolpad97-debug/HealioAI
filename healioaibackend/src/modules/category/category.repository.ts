import { FilterQuery } from 'mongoose';
import { BaseRepository } from '../../common/repository/base.repository';
import { CategoryModel, ICategory } from './category.model';

export class CategoryRepository extends BaseRepository<ICategory> {
  constructor() {
    super(CategoryModel);
  }

  async findByCode(code: string): Promise<ICategory | null> {
    return this.model.findOne({ code, isActive: true });
  }

  async existsByCode(code: string): Promise<boolean> {
    const count = await this.model.countDocuments({ code });
    return count > 0;
  }

  async findActiveById(id: string): Promise<ICategory | null> {
    return this.findOne({
      _id: id,
      isDeleted: false,
      isActive: true,
    } as FilterQuery<ICategory>);
  }
}
