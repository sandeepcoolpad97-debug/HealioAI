import mongoose, { Document } from "mongoose";
import { auditPlugin } from "../../common/schemas/audit.schema";
import { IAuditFields } from "../../common/types/audit.types";

/* =========================
   SUB SCHEMA: Reply Attachments
========================= */

const TicketHistoryAttachmentSchema = new mongoose.Schema(
  {
    fileName: { type: String, required: true },
    fileUrl: { type: String, required: true },
    fileType: { type: String, required: true },
    fileSize: { type: Number, required: true },
  },
  { _id: true, timestamps: true }
);

/* =========================
   Ticket History Schema
========================= */

const SupportTicketHistorySchema = new mongoose.Schema(
  {
    ticketId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "SupportTicket",
      required: true,
      index: true,
    },

    action: {
      type: String,
      enum: [
        "created",
        "user_reply",
        "agent_reply",
        "status_changed",
        "priority_changed",
        "category_changed",
        "assigned",
        "closed",
        "reopened",
      ],
      required: true,
      index: true,
    },

    message: {
      type: String,
      default: null, // reply text
      trim: true,
    },

    oldValue: {
      type: Object,
      default: null,
    },

    newValue: {
      type: Object,
      default: null,
    },

    performedByRole: {
      type: String,
      enum: ["User", "Clinic", "Lab", "Admin", "SupportAgent", "System"],
      required: true,
      index: true,
    },

    performedById: {
      type: mongoose.Schema.Types.ObjectId,
      refPath: "performedByRole",
      default: null,
    },

    attachments: {
      type: [TicketHistoryAttachmentSchema],
      default: [],
    },
  },
  { timestamps: false }
);

SupportTicketHistorySchema.plugin(auditPlugin);

SupportTicketHistorySchema.index({ ticketId: 1, createdAt: 1 });

export interface ISupportTicketHistory extends Document, IAuditFields {
  ticketId: mongoose.Types.ObjectId;

  action:
    | "created"
    | "user_reply"
    | "agent_reply"
    | "status_changed"
    | "priority_changed"
    | "category_changed"
    | "assigned"
    | "closed"
    | "reopened";

  message?: string | null;

  oldValue?: any;
  newValue?: any;

  performedByRole: "User" | "Clinic" | "Lab" | "Admin" | "SupportAgent" | "System";
  performedById?: mongoose.Types.ObjectId | null;

  attachments?: {
    fileName: string;
    fileUrl: string;
    fileType: string;
    fileSize: number;
  }[];
}

export const SupportTicketHistoryModel = mongoose.model<ISupportTicketHistory>(
  "SupportTicketHistory",
  SupportTicketHistorySchema
);

export default SupportTicketHistoryModel;
