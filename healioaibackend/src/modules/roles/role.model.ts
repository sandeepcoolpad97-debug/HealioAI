import mongoose, { Document } from "mongoose";
import { auditPlugin } from "../../common/schemas/audit.schema";
import { IAuditFields } from "../../common/types/audit.types";

const RoleSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true
    },

    description: {
      type: String
    },

    permissions: {
      type: [String],
      default: []
    },

    isSystemRole: {
      type: Boolean,
      default: false
    }
  },
  { timestamps: false }
);

RoleSchema.plugin(auditPlugin);

export interface IRole extends Document, IAuditFields {
  name: string;
  description?: string;
  permissions: string[];
  isSystemRole: boolean;
}

export const RoleModel = mongoose.model<IRole>("Role", RoleSchema);
export default RoleModel;
