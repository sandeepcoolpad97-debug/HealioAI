import mongoose, { Document } from "mongoose";
import { auditPlugin } from "../../common/schemas/audit.schema";
import { IAuditFields } from "../../common/types/audit.types";

const SubscriptionSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true
    },

    code: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true
    },

    price: {
      type: Number,
      default: 0,
      min: 0
    },

    currency: {
      type: String,
      default: "INR"
    },

    durationInDays: {
      type: Number,
      min: 1
    },

    features: {
      type: [String],
      default: []
    },

    isSystemPlan: {
      type: Boolean,
      default: false
    }
  },
  { timestamps: false }
);

SubscriptionSchema.plugin(auditPlugin);

export interface ISubscription extends Document, IAuditFields {
  name: string;
  code: string;
  price: number;
  currency: string;
  durationInDays?: number;
  features: string[];
  isSystemPlan: boolean;
}

export const SubscriptionModel = mongoose.model<ISubscription>("Subscription", SubscriptionSchema);
export default SubscriptionModel;
