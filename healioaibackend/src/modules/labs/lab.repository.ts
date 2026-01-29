import { FilterQuery } from 'mongoose';
import { BaseRepository } from '../../common/repository/base.repository';
import { getPaginationParams, paginated, PaginatedResult } from '../../common/pagination/pagination';
import { LabModel, ILab } from './Lab.model';

export class LabRepository extends BaseRepository<ILab> {
  constructor() {
    super(LabModel);
  }

  async findByRegistrationNumber(registrationNumber: string): Promise<ILab | null> {
    return this.findOne({ registrationNumber: registrationNumber.trim() } as FilterQuery<ILab>);
  }

  async existsByRegistrationNumber(registrationNumber: string): Promise<boolean> {
    const count = await this.count({
      registrationNumber: registrationNumber.trim(),
    } as FilterQuery<ILab>);
    return count > 0;
  }

  async findByEmailId(emailId: string): Promise<ILab | null> {
    if (!emailId || !emailId.trim()) return null;
    return this.findOne({ emailId: emailId.trim().toLowerCase() } as FilterQuery<ILab>);
  }

  async existsByEmailId(emailId: string): Promise<boolean> {
    if (!emailId || !emailId.trim()) return false;
    const count = await this.count({
      emailId: emailId.trim().toLowerCase(),
    } as FilterQuery<ILab>);
    return count > 0;
  }

  async findActiveById(id: string): Promise<ILab | null> {
    return this.findOne({
      _id: id,
      isDeleted: false,
      isActive: true,
    } as FilterQuery<ILab>);
  }

  async findActiveByIdWithRefs(id: string): Promise<ILab | null> {
    const doc = await this.model
      .findOne({
        _id: id,
        isDeleted: false,
        isActive: true,
      } as FilterQuery<ILab>)
      .populate('roleId', 'name')
      .exec();
    return doc as ILab | null;
  }

  async findPaginatedWithRefs(
    filter: FilterQuery<ILab>,
    page: number,
    limit: number
  ): Promise<PaginatedResult<ILab>> {
    const params = getPaginationParams(page, limit);
    const [data, total] = await Promise.all([
      this.model
        .find(filter)
        .populate('roleId', 'name')
        .skip(params.skip)
        .limit(params.limit)
        .exec(),
      this.model.countDocuments(filter).exec(),
    ]);
    return paginated(data as ILab[], total, params);
  }
}
