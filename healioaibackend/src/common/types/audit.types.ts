import { Types } from 'mongoose';

/**
 * Common audit fields for entities that track who/when created, updated, deleted,
 * and soft-delete / active status.
 */
export interface IAuditFields {
  createdBy?: Types.ObjectId;
  updatedBy?: Types.ObjectId;
  deletedBy?: Types.ObjectId;
  createdAt?: Date;
  updatedAt?: Date;
  deletedAt?: Date;
  isActive: boolean;
  isDeleted: boolean;
}
