import mongoose, { Document } from 'mongoose';
import { auditPlugin } from '../../common/schemas/audit.schema';
import { IAuditFields } from '../../common/types/audit.types';

const MediaSchema = new mongoose.Schema(
  {
    publicId: {
      type: String,
      required: true,
      unique: true,
      index: true,
    },
    url: {
      type: String,
      required: true,
    },
    secureUrl: {
      type: String,
    },
    resourceType: {
      type: String,
    },
    format: {
      type: String,
    },
    bytes: {
      type: Number,
    },
    width: {
      type: Number,
    },
    height: {
      type: Number,
    },
    folder: {
      type: String,
    },
    originalFilename: {
      type: String,
    },
    tags: {
      type: [String],
      default: [],
    },
    context: {
      type: mongoose.Schema.Types.Mixed,
    },
    ownerType: {
      type: String,
    },
    ownerId: {
      type: mongoose.Schema.Types.ObjectId,
      refPath: 'ownerType',
    },
    description: {
      type: String,
    },
  },
  {
    timestamps: false,
  }
);

MediaSchema.plugin(auditPlugin);

export interface IMedia extends Document, IAuditFields {
  publicId: string;
  url: string;
  secureUrl?: string;
  resourceType?: string;
  format?: string;
  bytes?: number;
  width?: number;
  height?: number;
  folder?: string;
  originalFilename?: string;
  tags: string[];
  context?: any;
  ownerType?: string;
  ownerId?: mongoose.Types.ObjectId;
  description?: string;
}

export const MediaModel = mongoose.model<IMedia>('Media', MediaSchema);
export default MediaModel;

