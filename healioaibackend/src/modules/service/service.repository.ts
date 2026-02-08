import { BaseRepository } from '../../common/repository/base.repository';
import { IService, ServiceModel } from './service.model';

export class ServiceRepository extends BaseRepository<IService> {
  constructor() {
    super(ServiceModel);
  }

  async findByCode(code: string): Promise<IService | null> {
    return this.model.findOne({ code, isDeleted: false });
  }

  async existsByCode(code: string, excludeId?: string): Promise<boolean> {
    const query: any = { code, isDeleted: false };
    if (excludeId) {
      query._id = { $ne: excludeId };
    }
    const count = await this.model.countDocuments(query);
    return count > 0;
  }
}
