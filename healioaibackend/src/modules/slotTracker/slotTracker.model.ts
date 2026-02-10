import mongoose, { Document } from "mongoose";
import { auditPlugin } from "../../common/schemas/audit.schema";
import { IAuditFields } from "../../common/types/audit.types";

/* =========================
   Slot Tracker Schema
========================= */

const SlotTrackerSchema = new mongoose.Schema(
  {
    doctorId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Clinic",
      required: true,
      index: true,
    },

    date: {
      type: String, // "2026-02-10"
      required: true,
      index: true,
    },

    slotStartAt: {
      type: Date,
      required: true,
      index: true,
    },

    slotEndAt: {
      type: Date,
      required: true,
      index: true,
    },

    durationMinutes: {
      type: Number,
      default: 30,
      enum: [30], // ✅ enforce 30 mins only
    },

    status: {
      type: String,
      enum: ["available", "locked", "booked", "cancelled"],
      default: "available",
      index: true,
    },

    appointmentId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Appointment",
      default: null,
      index: true,
    },

    lockedByUserId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      default: null,
    },

    lockExpiresAt: {
      type: Date,
      default: null,
      index: true,
    },
  },
  {
    timestamps: false,
  }
);

/* =========================
   Plugins & Indexes
========================= */

SlotTrackerSchema.plugin(auditPlugin);

// Prevent duplicate slot for same doctor + same start time
SlotTrackerSchema.index(
  { doctorId: 1, slotStartAt: 1 },
  { unique: true }
);

// Fast availability queries
SlotTrackerSchema.index({ doctorId: 1, date: 1, status: 1 });

/* =========================
   Interface
========================= */

export interface ISlotTracker extends Document, IAuditFields {
  doctorId: mongoose.Types.ObjectId;

  date: string;

  slotStartAt: Date;
  slotEndAt: Date;

  durationMinutes: 30;

  status: "available" | "locked" | "booked" | "cancelled";

  appointmentId?: mongoose.Types.ObjectId | null;

  lockedByUserId?: mongoose.Types.ObjectId | null;
  lockExpiresAt?: Date | null;
}

/* =========================
   Model
========================= */

export const SlotTrackerModel = mongoose.model<ISlotTracker>(
  "SlotTracker",
  SlotTrackerSchema
);

export default SlotTrackerModel;
