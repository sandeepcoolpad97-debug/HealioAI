import { FilterQuery } from 'mongoose';
import { BaseRepository } from '../../common/repository/base.repository';
import { getPaginationParams, paginated, PaginatedResult } from '../../common/pagination/pagination';
import { AdminModel, IAdmin } from './admin.model';

const ADMIN_REF_POPULATE = [
  { path: 'roleId', select: 'name' },
];

export class AdminRepository extends BaseRepository<IAdmin> {
  constructor() {
    super(AdminModel);
  }

  async findByPhoneNumber(number: string): Promise<IAdmin | null> {
    return this.findOne({ 'phone.number': number } as FilterQuery<IAdmin>);
  }

  async findByFirebaseUid(firebaseUid: string): Promise<IAdmin | null> {
    return this.findOne({ firebaseUid } as FilterQuery<IAdmin>);
  }

  async existsByPhoneNumber(number: string): Promise<boolean> {
    const count = await this.count({ 'phone.number': number } as FilterQuery<IAdmin>);
    return count > 0;
  }

  async findByEmail(email: string): Promise<IAdmin | null> {
    if (!email || !email.trim()) return null;
    return this.findOne({ email: email.trim().toLowerCase() } as FilterQuery<IAdmin>);
  }

  async existsByEmail(email: string): Promise<boolean> {
    if (!email || !email.trim()) return false;
    const count = await this.count({ email: email.trim().toLowerCase() } as FilterQuery<IAdmin>);
    return count > 0;
  }

  async findActiveById(id: string): Promise<IAdmin | null> {
    return this.findOne({
      _id: id,
      isDeleted: false,
      isActive: true,
    } as FilterQuery<IAdmin>);
  }

  async findActiveByIdWithRefs(id: string): Promise<IAdmin | null> {
    const filter = {
      _id: id,
      isDeleted: false,
      isActive: true,
    } as FilterQuery<IAdmin>;
    return this.model
      .findOne(filter)
      .populate(ADMIN_REF_POPULATE[0])
      .exec() as Promise<IAdmin | null>;
  }

  async findPaginatedWithRefs(
    filter: FilterQuery<IAdmin>,
    page: number,
    limit: number
  ): Promise<PaginatedResult<IAdmin>> {
    const params = getPaginationParams(page, limit);
    const [data, total] = await Promise.all([
      this.model
        .find(filter)
        .populate(ADMIN_REF_POPULATE[0])
        .skip(params.skip)
        .limit(params.limit)
        .exec(),
      this.model.countDocuments(filter).exec(),
    ]);
    return paginated(data as IAdmin[], total, params);
  }
}
