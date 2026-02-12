import mongoose, { Document } from "mongoose";
import { auditPlugin } from "../../common/schemas/audit.schema";
import { IAuditFields } from "../../common/types/audit.types";

const NotificationSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },

    typeId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "NotificationType",
      required: true,
      index: true,
    },

    // These are stored final values (after template rendering)
    title: {
      type: String,
      required: true,
      trim: true,
    },

    message: {
      type: String,
      required: true,
      trim: true,
    },

    action: {
      label: { type: String, default: null },
      route: { type: String, default: null },
      meta: { type: Object, default: {} },
    },

    isRead: {
      type: Boolean,
      default: false,
      index: true,
    },

    readAt: {
      type: Date,
      default: null,
    },

    channels: {
      inApp: { type: Boolean, default: true },
      push: { type: Boolean, default: true },
      sms: { type: Boolean, default: false },
    },

    pushStatus: {
      type: String,
      enum: ["pending", "sent", "failed", "skipped"],
      default: "pending",
      index: true,
    },

    pushSentAt: { type: Date, default: null },
    pushError: { type: String, default: null },

    reference: {
      refType: {
        type: String,
        enum: ["Appointment", "LabOrder", "Payment", "Clinic", "General"],
        default: "General",
      },
      refId: {
        type: mongoose.Schema.Types.ObjectId,
        default: null,
        index: true,
      },
    },
  },
  { timestamps: false }
);

NotificationSchema.plugin(auditPlugin);

NotificationSchema.index({ userId: 1, isRead: 1, createdAt: -1 });

export interface INotification extends Document, IAuditFields {
  userId: mongoose.Types.ObjectId;
  typeId: mongoose.Types.ObjectId;

  title: string;
  message: string;

  action?: {
    label?: string | null;
    route?: string | null;
    meta?: Record<string, any>;
  };

  isRead: boolean;
  readAt?: Date | null;

  channels: {
    inApp: boolean;
    push: boolean;
    sms: boolean;
  };

  pushStatus: "pending" | "sent" | "failed" | "skipped";
  pushSentAt?: Date | null;
  pushError?: string | null;

  reference?: {
    refType: "Appointment" | "LabOrder" | "Payment" | "Clinic" | "General";
    refId?: mongoose.Types.ObjectId | null;
  };
}

export const NotificationModel = mongoose.model<INotification>(
  "Notification",
  NotificationSchema
);

export default NotificationModel;
