import { FilterQuery } from 'mongoose';
import { BaseRepository } from '../../common/repository/base.repository';
import { IMedia, MediaModel } from './media.model';

export class MediaRepository extends BaseRepository<IMedia> {
  constructor() {
    super(MediaModel);
  }

  async findActiveById(id: string): Promise<IMedia | null> {
    return this.findOne({
      _id: id,
      isDeleted: false,
    } as FilterQuery<IMedia>);
  }

  async findByPublicId(publicId: string): Promise<IMedia | null> {
    return this.findOne({
      publicId,
      isDeleted: false,
    } as FilterQuery<IMedia>);
  }
}

