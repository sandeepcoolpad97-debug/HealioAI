import mongoose, { Schema } from 'mongoose';

/**
 * Mongoose schema definition for common audit fields.
 * Add to any schema via schema.add(auditSchemaFields) or use auditPlugin.
 * Use { timestamps: false } on the schema when using this plugin to avoid duplicate paths.
 *
 * Fields: createdBy, updatedBy, deletedBy, createdAt, updatedAt, deletedAt, isActive, isDeleted
 */
export const auditSchemaFields: Record<string, mongoose.SchemaDefinitionProperty> = {
  createdBy: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    default: null,
  },
  updatedBy: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    default: null,
  },
  deletedBy: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    default: null,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  updatedAt: {
    type: Date,
    default: Date.now,
  },
  deletedAt: {
    type: Date,
    default: null,
  },
  isActive: {
    type: Boolean,
    default: true,
  },
  isDeleted: {
    type: Boolean,
    default: false,
  },
};

/**
 * Plugin that adds audit fields and keeps updatedAt in sync on save.
 * Apply to a schema with { timestamps: false } so audit fields are the single source of truth.
 */
export function auditPlugin(schema: Schema): void {
  schema.add(auditSchemaFields);
  schema.pre('save', function (next) {
    this.updatedAt = new Date();
    next();
  });
}
