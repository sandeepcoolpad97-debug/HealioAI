import { FilterQuery } from 'mongoose';
import { BaseRepository } from '../../common/repository/base.repository';
import { RoleModel, IRole } from './role.model';

export class RoleRepository extends BaseRepository<IRole> {
  constructor() {
    super(RoleModel);
  }

  async findByName(name: string): Promise<IRole | null> {
    return this.findOne({ name: name.toLowerCase() } as FilterQuery<IRole>);
  }

  async existsByName(name: string): Promise<boolean> {
    const count = await this.count({ name: name.toLowerCase() } as FilterQuery<IRole>);
    return count > 0;
  }

  async findActiveById(id: string): Promise<IRole | null> {
    return this.findOne({
      _id: id,
      isDeleted: false,
      isActive: true,
    } as FilterQuery<IRole>);
  }
}
