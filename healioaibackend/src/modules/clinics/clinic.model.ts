import mongoose, { Document } from "mongoose";
import { auditPlugin } from "../../common/schemas/audit.schema";
import { IAuditFields } from "../../common/types/audit.types";

/* =========================
   Clinic Schema
========================= */

const ClinicSchema = new mongoose.Schema(
  {
    /* ---------------- BASIC INFO ---------------- */
    clinicName: {
      type: String,
      required: true,
      trim: true
    },

    registrationNumber: {
      type: String,
      required: true,
      unique: true,
      trim: true
    },

    roleId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Role",
      required: true
    },

    address: {
      type: String
    },

    establishmentDate: {
      type: Date
    },

    contactNumber: {
      type: String,
      required: true
    },

    emailId: {
      type: String,
      trim: true,
      lowercase: true,
      unique: true
    },

    /* ---------------- OPERATING HOURS ---------------- */
    operatingHours: [
      {
        day: {
          type: String,
          enum: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"],
          required: true
        },
        openTime: {
          type: String,
          required: true
        },
        closeTime: {
          type: String,
          required: true
        },
        isClosed: {
          type: Boolean,
          default: false
        }
      }
    ],

    /* ---------------- MEDICAL DETAILS ---------------- */
    specialisation: {
      type: [String],
      required: true,
      default: []
    },

    consultationType: {
      type: String,
      enum: ["in_person", "online", "both"],
      default: "in_person"
    },

    /* ---------------- DOCTOR ---------------- */
    doctorName: {
      type: String,
      required: true,
      trim: true
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

    /* ---------------- SYSTEM FLAGS ---------------- */
    isActive: {
      type: Boolean,
      default: true
    }
  },
  {
    timestamps: false
  }
);

/* =========================
   Plugins & Indexes
========================= */

ClinicSchema.plugin(auditPlugin);

ClinicSchema.index({ clinicName: 1 });
ClinicSchema.index({ emailId: 1 });
ClinicSchema.index({ doctorName: 1 });

/* =========================
   Interface
========================= */

export interface IClinic extends Document, IAuditFields {
  clinicName: string;
  registrationNumber: string;
  roleId: mongoose.Types.ObjectId;
  address?: string;
  establishmentDate?: Date;
  contactNumber: string;
  emailId?: string;

  operatingHours?: {
    day: "Mon" | "Tue" | "Wed" | "Thu" | "Fri" | "Sat" | "Sun";
    openTime: string;
    closeTime: string;
    isClosed?: boolean;
  }[];

  specialisation: string[];

  consultationType: "in_person" | "online" | "both";

  doctorName: string;

  consents: {
    termsAndConditions: boolean;
    policyTerms: boolean;
    medicalDisclaimer: boolean;
    acceptedAt?: Date;
  };

  isActive: boolean;
};

export const ClinicModel = mongoose.model<IClinic>("Clinic", ClinicSchema);
export default ClinicModel;
