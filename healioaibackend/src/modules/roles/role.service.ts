import { AppError } from '../../common/errors/app-error';
import { ErrorCode } from '../../common/errors/error-codes';
import { HTTP_STATUS } from '../../common/constants';
import { PaginatedResult } from '../../common/pagination/pagination';
import { RoleRepository } from './role.repository';
import { IRole } from './role.model';
import { CreateRoleInput, UpdateRoleInput } from './role.validation';

export class RoleService {
  private readonly roleRepository = new RoleRepository();

  async create(data: CreateRoleInput): Promise<IRole> {
    const exists = await this.roleRepository.existsByName(data.name);
    if (exists) {
      throw new AppError(
        ErrorCode.CONFLICT,
        HTTP_STATUS.CONFLICT,
        'Role with this name already exists'
      );
    }
    return this.roleRepository.create(data as Partial<IRole>);
  }

  async getById(id: string): Promise<IRole> {
    const role = await this.roleRepository.findActiveById(id);
    if (!role) {
      throw new AppError(
        ErrorCode.NOT_FOUND,
        HTTP_STATUS.NOT_FOUND,
        'Role not found'
      );
    }
    return role;
  }

  async list(page: number, limit: number): Promise<PaginatedResult<IRole>> {
    return this.roleRepository.findPaginated({ isDeleted: false }, page, limit);
  }

  async update(id: string, data: UpdateRoleInput): Promise<IRole> {
    const role = await this.getById(id);
    if (data.name && data.name !== role.name) {
      const exists = await this.roleRepository.existsByName(data.name);
      if (exists) {
        throw new AppError(
          ErrorCode.CONFLICT,
          HTTP_STATUS.CONFLICT,
          'Role with this name already exists'
        );
      }
    }
    if (role.isSystemRole && data.isSystemRole === false) {
      throw new AppError(
        ErrorCode.BAD_REQUEST,
        HTTP_STATUS.BAD_REQUEST,
        'Cannot unset system role flag on a system role'
      );
    }
    const updated = await this.roleRepository.updateById(id, { $set: data });
    if (!updated) {
      throw new AppError(
        ErrorCode.NOT_FOUND,
        HTTP_STATUS.NOT_FOUND,
        'Role not found'
      );
    }
    return updated;
  }

  async delete(id: string): Promise<void> {
    const role = await this.roleRepository.findById(id);
    if (!role) {
      throw new AppError(
        ErrorCode.NOT_FOUND,
        HTTP_STATUS.NOT_FOUND,
        'Role not found'
      );
    }
    if (role.isSystemRole) {
      throw new AppError(
        ErrorCode.BAD_REQUEST,
        HTTP_STATUS.BAD_REQUEST,
        'Cannot delete a system role'
      );
    }
    const deleted = await this.roleRepository.deleteById(id);
    if (!deleted) {
      throw new AppError(
        ErrorCode.NOT_FOUND,
        HTTP_STATUS.NOT_FOUND,
        'Role not found'
      );
    }
  }
}
