import mongoose, { Document } from "mongoose";
import { auditPlugin } from "../../common/schemas/audit.schema";
import { IAuditFields } from "../../common/types/audit.types";

const ReviewSchema = new mongoose.Schema(
  {
    appointmentId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Appointment",
      required: true,
      unique: true, // ✅ one review per appointment
      index: true,
    },

    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },

    reviewFor: {
      type: String,
      enum: ["Clinic", "Lab"],
      required: true,
      index: true,
    },

    reviewForId: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      refPath: "reviewFor",
      index: true,
    },

    rating: {
      type: Number,
      required: true,
      min: 1,
      max: 5,
    },

    comment: {
      type: String,
      trim: true,
      maxlength: 1000,
      default: "",
    },
  },
  { timestamps: false }
);

ReviewSchema.plugin(auditPlugin);

ReviewSchema.index({ reviewFor: 1, reviewForId: 1 });

export interface IReview extends Document, IAuditFields {
  appointmentId: mongoose.Types.ObjectId;
  userId: mongoose.Types.ObjectId;
  reviewFor: "Clinic" | "Lab";
  reviewForId: mongoose.Types.ObjectId;
  rating: number;
  comment?: string;
}

export const ReviewModel = mongoose.model<IReview>("Review", ReviewSchema);
export default ReviewModel;
