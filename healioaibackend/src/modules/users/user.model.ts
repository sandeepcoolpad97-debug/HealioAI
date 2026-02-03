import mongoose, { Document } from "mongoose";
import { auditPlugin } from "../../common/schemas/audit.schema";
import { IAuditFields } from "../../common/types/audit.types";

const UserSchema = new mongoose.Schema(
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

    age: {
      type: Number,
      min: 0,
      max: 120
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

    /* ---------------- MEDICAL INFO ---------------- */
    medical: {
      existingConditions: {
        type: [String],
        default: []
      },
      otherConditions: {
        type: String
      }
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
      medicalDisclaimer: {
        type: Boolean,
        required: true
      },
      acceptedAt: {
        type: Date,
        default: Date.now
      }
    },

    /* ---------------- PHONE / AUTH ---------------- */
    email: {
      type: String,
      trim: true,
      lowercase: true,
      sparse: true,
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

    /* ---------------- SUBSCRIPTION ---------------- */
    subscriptionId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Subscription",
      required: true
    },

    subscriptionStatus: {
      type: String,
      enum: ["active", "expired", "cancelled", "trial"],
      default: "active"
    },

    /* ---------------- SYSTEM FLAGS ---------------- */
    lastLoginAt: {
      type: Date
    }
  },
  { timestamps: false }
);

UserSchema.plugin(auditPlugin);

export interface IUser extends Document, IAuditFields {
  firebaseUid: string;
  name: string;
  age?: number;
  gender: string;
  language?: string;
  roleId: mongoose.Types.ObjectId;
  medical?: {
    existingConditions?: string[];
    otherConditions?: string;
  };
  consents: {
    termsAndConditions: boolean;
    policyTerms: boolean;
    medicalDisclaimer: boolean;
    acceptedAt?: Date;
  };
  email?: string;
  phone: {
    countryCode: string;
    number: string;
    verified: boolean;
  };
  subscriptionId: mongoose.Types.ObjectId;
  subscriptionStatus: "active" | "expired" | "cancelled" | "trial";
  lastLoginAt?: Date;
}

export const UserModel = mongoose.model<IUser>("User", UserSchema);
export default UserModel;
