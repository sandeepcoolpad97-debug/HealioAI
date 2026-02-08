import { BaseRepository } from '../../common/repository/base.repository';
import { paginated } from '../../common/pagination/pagination';
import { IDiscount, DiscountModel } from './discount.model';

export class DiscountRepository extends BaseRepository<IDiscount> {
  constructor() {
    super(DiscountModel);
  }

  // Override to populate service details
  async findPaginatedWithService(
    query: any,
    page: number,
    limit: number
  ) {
    const skip = (page - 1) * limit;
    
    const [data, total] = await Promise.all([
      this.model
        .find(query)
        .populate('serviceId', 'name code')
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit)
        .exec(),
      this.model.countDocuments(query),
    ]);

    return paginated(data, total, { page, limit, skip });
  }

  async findByIdWithService(id: string): Promise<IDiscount | null> {
    return this.model.findById(id).populate('serviceId', 'name code');
  }
}
