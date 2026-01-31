/**
 * Common audit fields for entities that track who/when created, updated, deleted,
 * and soft-delete / active status.
 */
export interface IAuditFields {
  createdBy?: string;
  updatedBy?: string;
  deletedBy?: string;
  createdAt?: Date;
  updatedAt?: Date;
  deletedAt?: Date;
  isActive: boolean;
  isDeleted: boolean;
}
