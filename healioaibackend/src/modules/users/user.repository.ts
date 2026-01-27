import { FilterQuery } from 'mongoose';
import { BaseRepository } from '../../common/repository/base.repository';
import { UserModel, IUser } from './user.model';

export class UserRepository extends BaseRepository<IUser> {
  constructor() {
    super(UserModel);
  }

  async findByEmail(email: string): Promise<IUser | null> {
    return this.findOne({ email: email.toLowerCase() } as FilterQuery<IUser>);
  }

  async existsByEmail(email: string): Promise<boolean> {
    const count = await this.count({ email: email.toLowerCase() } as FilterQuery<IUser>);
    return count > 0;
  }
}
