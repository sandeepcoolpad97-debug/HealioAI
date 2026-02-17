import { v2 as cloudinary } from 'cloudinary';
import { v4 as uuidv4 } from 'uuid';
import { env } from '../../common/config/env';
import { AppError } from '../../common/errors/app-error';
import { ErrorCode } from '../../common/errors/error-codes';
import { HTTP_STATUS } from '../../common/constants';
import { MediaRepository } from './media.repository';
import { IMedia } from './media.model';
import { CreateMediaInput, UpdateMediaInput } from './media.validation';

cloudinary.config({
  cloud_name: env.CLOUDINARY_NAME,
  api_key: env.CLOUDINARY_API_KEY,
  api_secret: env.CLOUDINARY_API_SECRET,
});

export class MediaService {
  private readonly mediaRepository = new MediaRepository();

  private ensureCloudinaryConfig(): void {
    if (!env.CLOUDINARY_NAME || !env.CLOUDINARY_API_KEY || !env.CLOUDINARY_API_SECRET) {
      throw new AppError(
        ErrorCode.INTERNAL_ERROR,
        HTTP_STATUS.INTERNAL_SERVER_ERROR,
        'Cloudinary configuration is missing'
      );
    }
  }

  async create(data: CreateMediaInput, actorId?: string): Promise<IMedia> {
    this.ensureCloudinaryConfig();

    const uploadResult = await cloudinary.uploader.upload(data.file, {
      folder: data.folder,
      resource_type: 'auto',
      tags: data.tags,
      context: data.context,
    });

    const payload: Partial<IMedia> = {
      publicId: uploadResult.public_id,
      url: uploadResult.secure_url || uploadResult.url,
      secureUrl: uploadResult.secure_url,
      resourceType: uploadResult.resource_type,
      format: uploadResult.format,
      bytes: uploadResult.bytes,
      width: uploadResult.width,
      height: uploadResult.height,
      folder: uploadResult.folder,
      originalFilename: uploadResult.original_filename,
      tags: uploadResult.tags ?? data.tags ?? [],
      context: (uploadResult as any).context ?? data.context,
      ownerType: data.ownerType,
      ownerId: data.ownerId as any,
      description: data.description,
      createdBy: actorId || uuidv4(),
      updatedBy: actorId || uuidv4(),
    };

    return this.mediaRepository.create(payload as Partial<IMedia>);
  }

  async getById(id: string): Promise<IMedia> {
    const media = await this.mediaRepository.findById(id);
    if (!media || media.isDeleted) {
      throw new AppError(
        ErrorCode.NOT_FOUND,
        HTTP_STATUS.NOT_FOUND,
        'Media not found'
      );
    }
    return media;
  }

  async update(id: string, data: UpdateMediaInput, actorId?: string): Promise<IMedia> {
    const media = await this.getById(id);

    let publicId = media.publicId;
    let url = media.url;
    let secureUrl = media.secureUrl;
    let resourceType = media.resourceType;
    let format = media.format;
    let bytes = media.bytes;
    let width = media.width;
    let height = media.height;
    let folder = data.folder ?? media.folder;
    let tags = data.tags ?? media.tags;
    let context = data.context ?? (media.context as any);

    if (data.file) {
      this.ensureCloudinaryConfig();
      await cloudinary.uploader.destroy(media.publicId);
      const uploadResult = await cloudinary.uploader.upload(data.file, {
        folder,
        resource_type: 'auto',
        tags,
        context,
      });
      publicId = uploadResult.public_id;
      url = uploadResult.secure_url || uploadResult.url;
      secureUrl = uploadResult.secure_url;
      resourceType = uploadResult.resource_type;
      format = uploadResult.format;
      bytes = uploadResult.bytes;
      width = uploadResult.width;
      height = uploadResult.height;
      folder = uploadResult.folder;
      tags = uploadResult.tags ?? tags;
      context = (uploadResult as any).context ?? context;
    }

    const updatePayload: Partial<IMedia> = {
      publicId,
      url,
      secureUrl,
      resourceType,
      format,
      bytes,
      width,
      height,
      folder,
      tags,
      context,
      ownerType: data.ownerType ?? media.ownerType,
      ownerId: (data.ownerId as any) ?? media.ownerId,
      description: data.description ?? media.description,
      updatedBy: actorId || uuidv4(),
    };

    const updated = await this.mediaRepository.updateById(id, { $set: updatePayload as any });
    if (!updated) {
      throw new AppError(
        ErrorCode.NOT_FOUND,
        HTTP_STATUS.NOT_FOUND,
        'Media not found'
      );
    }
    return updated;
  }

  async delete(id: string): Promise<void> {
    const media = await this.getById(id);
    this.ensureCloudinaryConfig();
    await cloudinary.uploader.destroy(media.publicId);
    const deleted = await this.mediaRepository.deleteById(id);
    if (!deleted) {
      throw new AppError(
        ErrorCode.NOT_FOUND,
        HTTP_STATUS.NOT_FOUND,
        'Media not found'
      );
    }
  }
}

