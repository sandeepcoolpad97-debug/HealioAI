import mongoose, { Document } from "mongoose";
import { auditPlugin } from "../../common/schemas/audit.schema";
import { IAuditFields } from "../../common/types/audit.types";

/* ---------------- SUB SCHEMA: Slot History ---------------- */
const AppointmentSlotSchema = new mongoose.Schema(
  {
    startAt: {
      type: Date,
      required: true,
      index: true,
    },

    action: {
      type: String,
      enum: ["booked", "rescheduled", "cancelled"],
      default: "booked",
      required: true,
    },

    notes: {
      type: String,
      trim: true,
    },

    // For initial booking - patient symptoms
    symptoms: {
      type: [String],
      default: [],
    },

    // Category for reschedule/cancel
    category: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Category',
    },

    rescheduledByRole: {
      type: String,
      enum: ["User", "Clinic", "Lab", "Admin"],
    },
    
    rescheduledById: {
      type: mongoose.Schema.Types.ObjectId,
      refPath: "rescheduledByRole",
    }
  },
  {
    _id: true,
    timestamps: true,
  }
);

/* ---------------- MAIN SCHEMA ---------------- */
const AppointmentSchema = new mongoose.Schema(
  {
    appointmentId: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      index: true,
    },

    doctorId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Clinic",
      required: true,
      index: true,
    },

    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },

    /* ---------------- SLOT HISTORY ---------------- */
    appointmentInfo: {
      type: [AppointmentSlotSchema],
      required: true,
    },

    /* ---------------- CURRENT SLOT ---------------- */
    // ✅ this is always the active slot
    currentStartAt: {
      type: Date,
      required: true,
      index: true,
    },

    /* ---------------- RESCHEDULE TRACKING ---------------- */
    rescheduleCount: {
      type: Number,
      default: 0,
      min: 0,
    },

    /* ---------------- CONSULTATION ---------------- */
    consultationDuration: {
      type: Number,
      default: 30,
      min: 5,
    },

    consultationType: {
      type: String,
      enum: ["online", "in_person"],
      default: "in_person",
      required: true,
    },

    /* ---------------- OFFERS ---------------- */
    offersApplied: {
      type: [{ type: mongoose.Schema.Types.ObjectId, ref: "Discount" }],
      default: [],
    },

    /* ---------------- STATUS ---------------- */
    bookingStatus: {
      type: String,
      enum: ["confirmed", "rescheduled", "cancelled"],
      default: "confirmed",
      index: true,
    },

    cancellationNotes: {
      type: String,
      trim: true,
    },

    cancelledAt: {
      type: Date,
      default: null,
    },

    /* ---------------- PAYMENT ---------------- */
    paymentId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Payment",
      required: true,
      index: true,
    },

    /* ---------------- REVIEW STATUS ---------------- */
    isReviewAdded: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: false, // ✅ because auditPlugin will manage createdAt/updatedAt
  }
);

/* ---------------- PLUGINS ---------------- */
AppointmentSchema.plugin(auditPlugin);

/* ---------------- TYPES ---------------- */
export interface IAppointmentSlot {
  startAt: Date;
  action: "booked" | "rescheduled" | "cancelled";
  notes?: string;
  symptoms?: string[];
  category?: mongoose.Types.ObjectId;
  rescheduledByRole?: "User" | "Clinic" | "Lab" | "Admin";
  rescheduledById?: mongoose.Types.ObjectId;

  // from timestamps: true in sub schema
  createdAt?: Date;
  updatedAt?: Date;
}

export interface IAppointment extends Document, IAuditFields {
  appointmentId: string;

  doctorId: mongoose.Types.ObjectId;
  userId: mongoose.Types.ObjectId;

  appointmentInfo: IAppointmentSlot[];

  currentStartAt: Date;

  rescheduleCount: number;

  consultationDuration: number;
  consultationType: "online" | "in_person";

  offersApplied: mongoose.Types.ObjectId[];

  bookingStatus: "confirmed" | "rescheduled" | "cancelled";

  cancellationNotes?: string;
  cancelledAt?: Date | null;

  paymentId: mongoose.Types.ObjectId;
  isReviewAdded: boolean;
}

/* ---------------- MODEL ---------------- */
export const AppointmentModel = mongoose.model<IAppointment>(
  "Appointment",
  AppointmentSchema
);

export default AppointmentModel;
