import { FilterQuery } from 'mongoose';
import { BaseRepository } from '../../common/repository/base.repository';
import { getPaginationParams, paginated, PaginatedResult } from '../../common/pagination/pagination';
import { UserModel, IUser } from './user.model';

const USER_REF_POPULATE = [
  { path: 'roleId', select: 'name' },
  { path: 'subscriptionId', select: 'name' },
];

export class UserRepository extends BaseRepository<IUser> {
  constructor() {
    super(UserModel);
  }

  async findByPhoneNumber(number: string): Promise<IUser | null> {
    return this.findOne({ 'phone.number': number } as FilterQuery<IUser>);
  }

  async existsByPhoneNumber(number: string): Promise<boolean> {
    const count = await this.count({ 'phone.number': number } as FilterQuery<IUser>);
    return count > 0;
  }

  async findByEmail(email: string): Promise<IUser | null> {
    if (!email || !email.trim()) return null;
    return this.findOne({ email: email.trim().toLowerCase() } as FilterQuery<IUser>);
  }

  async existsByEmail(email: string): Promise<boolean> {
    if (!email || !email.trim()) return false;
    const count = await this.count({ email: email.trim().toLowerCase() } as FilterQuery<IUser>);
    return count > 0;
  }

  async findActiveById(id: string): Promise<IUser | null> {
    return this.findOne({
      _id: id,
      isDeleted: false,
      isActive: true,
    } as FilterQuery<IUser>);
  }

  async findActiveByIdWithRefs(id: string): Promise<IUser | null> {
    const filter = {
      _id: id,
      isDeleted: false,
      isActive: true,
    } as FilterQuery<IUser>;
    return this.model
      .findOne(filter)
      .populate(USER_REF_POPULATE[0])
      .populate(USER_REF_POPULATE[1])
      .exec() as Promise<IUser | null>;
  }

  async findPaginatedWithRefs(
    filter: FilterQuery<IUser>,
    page: number,
    limit: number
  ): Promise<PaginatedResult<IUser>> {
    const params = getPaginationParams(page, limit);
    const [data, total] = await Promise.all([
      this.model
        .find(filter)
        .populate(USER_REF_POPULATE[0])
        .populate(USER_REF_POPULATE[1])
        .skip(params.skip)
        .limit(params.limit)
        .exec(),
      this.model.countDocuments(filter).exec(),
    ]);
    return paginated(data as IUser[], total, params);
  }
}
