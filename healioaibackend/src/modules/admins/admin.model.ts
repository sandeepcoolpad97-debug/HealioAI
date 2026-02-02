import mongoose, { Document } from "mongoose";
import { auditPlugin } from "../../common/schemas/audit.schema";
import { IAuditFields } from "../../common/types/audit.types";

/* =========================
   Admin Schema
========================= */

const AdminSchema = new mongoose.Schema(
  {
    /* ---------------- BASIC PROFILE ---------------- */
    firebaseUid: {
      type: String,
      required: true,
      unique: true,
      trim: true
    },

    name: {
      type: String,
      required: true,
      trim: true
    },

    gender: {
      type: String,
      enum: ["male", "female", "other"],
      required: true
    },

    language: {
      type: String,
      default: "en"
    },

    /* ---------------- ROLE (RBAC) ---------------- */
    roleId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Role",
      required: true
    },

    /* ---------------- CONTACT INFO ---------------- */
    email: {
      type: String,
      required: true,
      trim: true,
      lowercase: true,
      unique: true
    },

    phone: {
      countryCode: {
        type: String,
        default: "+91"
      },
      number: {
        type: String,
        required: true,
        unique: true
      },
      verified: {
        type: Boolean,
        default: false
      }
    },

    address: {
      type: String,
      trim: true
    },

    /* ---------------- SYSTEM STATUS ---------------- */
    lastLoginAt: {
      type: Date
    },

    currentLoggedInStatus: {
      type: Boolean,
      default: false
    },

    /* ---------------- CONSENTS ---------------- */
    consents: {
      termsAndConditions: {
        type: Boolean,
        required: true
      },
      policyTerms: {
        type: Boolean,
        required: true
      },
      acceptedAt: {
        type: Date,
        default: Date.now
      }
    }
  },
  {
    timestamps: false
  }
);

/* ---------------- AUDIT PLUGIN ---------------- */
AdminSchema.plugin(auditPlugin);

/* =========================
   Admin Interface
========================= */

export interface IAdmin extends Document, IAuditFields {
  firebaseUid: string;
  name: string;
  gender: "male" | "female" | "other";
  language?: string;
  roleId: mongoose.Types.ObjectId;
  email: string;
  phone: {
    countryCode: string;
    number: string;
    verified: boolean;
  };
  address?: string;
  lastLoginAt?: Date;
  currentLoggedInStatus: boolean;
  consents: {
    termsAndConditions: boolean;
    policyTerms: boolean;
    acceptedAt?: Date;
  };
}

/* =========================
   Model Export
========================= */

export const AdminModel = mongoose.model<IAdmin>("Admin", AdminSchema);
export default AdminModel;
