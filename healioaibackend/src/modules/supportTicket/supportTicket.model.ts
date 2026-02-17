import mongoose, { Document } from "mongoose";
import { auditPlugin } from "../../common/schemas/audit.schema";
import { IAuditFields } from "../../common/types/audit.types";

/* =========================
   SUB SCHEMA: Attachments
========================= */

const SupportAttachmentSchema = new mongoose.Schema(
  {
    fileName: { type: String, required: true, trim: true },
    fileUrl: { type: String, required: true, trim: true },
    fileType: { type: String, required: true, trim: true }, // pdf/png/jpg
    fileSize: { type: Number, required: true }, // bytes
  },
  { _id: true, timestamps: true }
);

/* =========================
   MAIN: Support Ticket Schema
========================= */

const SupportTicketSchema = new mongoose.Schema(
  {
    ticketId: {
      type: String, // SUP-10234
      required: true,
      unique: true,
      index: true,
      trim: true,
    },

    /* ---------------- WHO RAISED ---------------- */
    raisedByRole: {
      type: String,
      enum: ["User", "Clinic", "Lab", "Admin"],
      required: true,
      index: true,
    },

    raisedById: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      refPath: "raisedByRole",
      index: true,
    },

    /* ---------------- TICKET CONTENT ---------------- */
    subject: {
      type: String,
      required: true,
      trim: true,
      index: true,
    },

    description: {
      type: String,
      required: true,
      trim: true,
    },

    /* ---------------- CATEGORY ---------------- */
    category: {
      type: String,
      required: true,
      trim: true,
      index: true,
    },

    subCategory: {
      type: String,
      required: true,
      trim: true,
      index: true,
    },

    /* ---------------- PRIORITY ---------------- */
    priority: {
      type: String,
      enum: ["low", "medium", "high", "urgent"],
      default: "medium",
      index: true,
    },

    /* ---------------- STATUS ---------------- */
    status: {
      type: String,
      enum: ["open", "in_progress", "closed"],
      default: "open",
      index: true,
    },

    /* ---------------- ASSIGNMENT ---------------- */
    assignedToRole: {
      type: String,
      enum: ["Admin", "SupportAgent"],
      default: null,
      index: true,
    },

    assignedToId: {
      type: mongoose.Schema.Types.ObjectId,
      refPath: "assignedToRole",
      default: null,
      index: true,
    },

    /* ---------------- OPTIONAL LINKED ENTITY ---------------- */
    reference: {
      refType: {
        type: String,
        enum: ["Appointment", "Payment", "LabOrder", "Prescription", "General"],
        default: "General",
      },
      refId: {
        type: mongoose.Schema.Types.ObjectId,
        default: null,
        index: true,
      },
    },

    /* ---------------- ATTACHMENTS ---------------- */
    attachments: {
      type: [SupportAttachmentSchema],
      default: [],
    },

    /* ---------------- TRACKING ---------------- */
    lastUpdatedAt: {
      type: Date,
      default: Date.now,
      index: true,
    },
  },
  { timestamps: false }
);

/* =========================
   Plugins & Indexes
========================= */

SupportTicketSchema.plugin(auditPlugin);

SupportTicketSchema.index({ raisedById: 1, status: 1, lastUpdatedAt: -1 });
SupportTicketSchema.index({ ticketId: 1, status: 1 });

/* =========================
   Types
========================= */

export interface ISupportAttachment {
  fileName: string;
  fileUrl: string;
  fileType: string;
  fileSize: number;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface ISupportTicket extends Document, IAuditFields {
  ticketId: string;

  raisedByRole: "User" | "Clinic" | "Lab" | "Admin";
  raisedById: mongoose.Types.ObjectId;

  subject: string;
  description: string;

  category: string;
  subCategory: string;

  priority: "low" | "medium" | "high" | "urgent";
  status: "open" | "in_progress" | "closed";

  assignedToRole?: "Admin" | "SupportAgent" | null;
  assignedToId?: mongoose.Types.ObjectId | null;

  reference?: {
    refType: "Appointment" | "Payment" | "LabOrder" | "Prescription" | "General";
    refId?: mongoose.Types.ObjectId | null;
  };

  attachments?: ISupportAttachment[];

  lastUpdatedAt: Date;
}

/* =========================
   Model
========================= */

export const SupportTicketModel = mongoose.model<ISupportTicket>(
  "SupportTicket",
  SupportTicketSchema
);

export default SupportTicketModel;
