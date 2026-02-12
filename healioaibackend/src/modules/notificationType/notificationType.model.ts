import mongoose, { Document } from "mongoose";
import { auditPlugin } from "../../common/schemas/audit.schema";
import { IAuditFields } from "../../common/types/audit.types";

const NotificationTypeSchema = new mongoose.Schema(
  {
    key: {
      type: String, // "appointment_confirmed"
      required: true,
      unique: true,
      trim: true,
      lowercase: true,
      index: true,
    },

    titleTemplate: {
      type: String, // "Appointment Confirmed"
      required: true,
      trim: true,
    },

    messageTemplate: {
      type: String, // "Your appointment with {{doctorName}} is confirmed..."
      required: true,
      trim: true,
    },

    defaultChannels: {
      inApp: { type: Boolean, default: true },
      push: { type: Boolean, default: true },
      sms: { type: Boolean, default: false },
    },

    defaultAction: {
      label: { type: String, default: null },
      route: { type: String, default: null },
    },

    icon: {
      type: String, // "calendar", "lab", "payment"
      default: "bell",
    },

    priority: {
      type: Number, // 1 = high, 5 = low
      default: 3,
      min: 1,
      max: 5,
    },
  },
  {
    timestamps: false,
  }
);

NotificationTypeSchema.plugin(auditPlugin);

export interface INotificationType extends Document, IAuditFields {
  key: string;
  titleTemplate: string;
  messageTemplate: string;

  defaultChannels: {
    inApp: boolean;
    push: boolean;
    sms: boolean;
  };

  defaultAction?: {
    label?: string | null;
    route?: string | null;
  };

  icon?: string;
  priority?: number;
}

export const NotificationTypeModel = mongoose.model<INotificationType>(
  "NotificationType",
  NotificationTypeSchema
);

export default NotificationTypeModel;
