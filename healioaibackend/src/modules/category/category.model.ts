import mongoose, { Document } from 'mongoose';
import { auditPlugin } from '../../common/schemas/audit.schema';
import { IAuditFields } from '../../common/types/audit.types';

const CategorySchema = new mongoose.Schema(
  {
    /* ---------------- BASIC INFO ---------------- */
    name: {
      type: String,
      required: true,
      trim: true,
      unique: true,
    },
    code: {
      type: String,
      required: true,
      trim: true,
      unique: true,
      lowercase: true,
    },
    description: {
      type: String,
      trim: true,
    }
  },
  {
    timestamps: false, // handled by auditPlugin
    versionKey: false,
  }
);

/* ---------------- PLUGINS ---------------- */
CategorySchema.plugin(auditPlugin);

/* ---------------- INTERFACES ---------------- */
export interface ICategory extends Document, IAuditFields {
  name: string;
  code: string;
  description?: string;
}

/* ---------------- MODEL ---------------- */
export const CategoryModel = mongoose.model<ICategory>('Category', CategorySchema);
export default CategoryModel;
