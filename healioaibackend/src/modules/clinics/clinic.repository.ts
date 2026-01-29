import { FilterQuery } from 'mongoose';
import { BaseRepository } from '../../common/repository/base.repository';
import { getPaginationParams, paginated, PaginatedResult } from '../../common/pagination/pagination';
import { ClinicModel, IClinic } from './clinic.model';

export class ClinicRepository extends BaseRepository<IClinic> {
  constructor() {
    super(ClinicModel);
  }

  async findByRegistrationNumber(registrationNumber: string): Promise<IClinic | null> {
    return this.findOne({ registrationNumber: registrationNumber.trim() } as FilterQuery<IClinic>);
  }

  async existsByRegistrationNumber(registrationNumber: string): Promise<boolean> {
    const count = await this.count({
      registrationNumber: registrationNumber.trim(),
    } as FilterQuery<IClinic>);
    return count > 0;
  }

  async findByEmailId(emailId: string): Promise<IClinic | null> {
    if (!emailId || !emailId.trim()) return null;
    return this.findOne({ emailId: emailId.trim().toLowerCase() } as FilterQuery<IClinic>);
  }

  async existsByEmailId(emailId: string): Promise<boolean> {
    if (!emailId || !emailId.trim()) return false;
    const count = await this.count({
      emailId: emailId.trim().toLowerCase(),
    } as FilterQuery<IClinic>);
    return count > 0;
  }

  async findActiveById(id: string): Promise<IClinic | null> {
    return this.findOne({
      _id: id,
      isDeleted: false,
      isActive: true,
    } as FilterQuery<IClinic>);
  }

  async findActiveByIdWithRefs(id: string): Promise<IClinic | null> {
    const doc = await this.model
      .findOne({
        _id: id,
        isDeleted: false,
        isActive: true,
      } as FilterQuery<IClinic>)
      .populate('roleId', 'name')
      .exec();
    return doc as IClinic | null;
  }

  async findPaginatedWithRefs(
    filter: FilterQuery<IClinic>,
    page: number,
    limit: number
  ): Promise<PaginatedResult<IClinic>> {
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
    return paginated(data as IClinic[], total, params);
  }
}
