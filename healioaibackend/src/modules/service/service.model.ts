import mongoose, { Document } from "mongoose";
import { auditPlugin } from "../../common/schemas/audit.schema";
import { IAuditFields } from "../../common/types/audit.types";

const ServiceSchema = new mongoose.Schema(
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
    },
  },
  {
    timestamps: false, // handled by auditPlugin
    versionKey: false,
  }
);

/* ---------------- PLUGINS ---------------- */
ServiceSchema.plugin(auditPlugin);

/* ---------------- INTERFACES ---------------- */
export interface IService extends Document, IAuditFields {
  name: string;
  code: string;
  description?: string;
}

/* ---------------- MODEL ---------------- */
export const ServiceModel = mongoose.model<IService>("Service", ServiceSchema);
export default ServiceModel;
