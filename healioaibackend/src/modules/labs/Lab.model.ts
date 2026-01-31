import mongoose, { Document } from "mongoose";
import { auditPlugin } from "../../common/schemas/audit.schema";
import { IAuditFields } from "../../common/types/audit.types";

/* =========================
   Lab Schema
========================= */

const LabSchema = new mongoose.Schema(
    {
        /* ---------------- BASIC DETAILS ---------------- */
        firebaseUid: {
            type: String,
            required: true,
            unique: true,
            trim: true
        },

        labName: {
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

        address: {
            type: String
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

        /* ---------------- ROLE (RBAC) ---------------- */
        roleId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Role",
            required: true
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

        /* ---------------- LAB SERVICES ---------------- */
        services: {
            testCategories: {
                type: [String],
                required: true,
                default: []
              },

            homeSampleCollection: {
                type: Boolean,
                default: false
            },

            reportDeliveryType: {
                type: [String],
                enum: ["pdf", "in_app"],
                default: []
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

LabSchema.plugin(auditPlugin);

LabSchema.index({ labName: 1 });
LabSchema.index({ emailId: 1 });
LabSchema.index({ roleId: 1 });
LabSchema.index({ "services.testCategories": 1 });

/* =========================
   Interface
========================= */

export interface ILab extends Document, IAuditFields {
  firebaseUid: string;
  labName: string;
    registrationNumber: string;
    address?: string;
    contactNumber: string;
    emailId?: string;

    roleId: mongoose.Types.ObjectId;

    operatingHours?: {
        day: "Mon" | "Tue" | "Wed" | "Thu" | "Fri" | "Sat" | "Sun";
        openTime: string;
        closeTime: string;
        isClosed?: boolean;
    }[];

    services: {
        testCategories: string[];
        homeSampleCollection: boolean;
        reportDeliveryType: ("pdf" | "in_app")[];
    };

    consents: {
        termsAndConditions: boolean;
        policyTerms: boolean;
        medicalDisclaimer: boolean;
        acceptedAt?: Date;
    };

    isActive: boolean;
}

/* =========================
   Model
========================= */

export const LabModel = mongoose.model<ILab>("Lab", LabSchema);
export default LabModel;
