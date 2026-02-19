import mongoose, { Document } from "mongoose";
import { auditPlugin } from "../../common/schemas/audit.schema";
import { IAuditFields } from "../../common/types/audit.types";

/* ---------------- REFUND SUB SCHEMA ---------------- */

const RefundSchema = new mongoose.Schema(
  {
    refundId: {
      type: String,
      required: true,
      trim: true,
    }, // Razorpay refund_id / Stripe refund id

    amount: {
      type: Number,
      required: true,
      min: 0,
    },

    status: {
      type: String,
      enum: ["initiated", "processing", "succeeded", "failed"],
      default: "initiated",
    },

    reason: {
      type: String,
      trim: true,
    },

    initiatedAt: {
      type: Date,
      default: Date.now,
    },

    processedAt: {
      type: Date,
    },

    providerMeta: {
      type: mongoose.Schema.Types.Mixed,
      default: {},
    },
  },
  { _id: false }
);

/* ---------------- PAYMENT MAIN SCHEMA ---------------- */

const PaymentSchema = new mongoose.Schema(
  {
    /* ---------------- WHO PAID ---------------- */
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },

    /* ---------------- WHAT THIS PAYMENT IS FOR ---------------- */
    paymentFor: {
      serviceId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Service",
        required: true,
        index: true,
      },

      refId: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        index: true,
      },
    },

    /* ---------------- PROVIDER DETAILS ---------------- */
    provider: {
      type: String,
      enum: ["razorpay", "stripe", "cash"],
      required: true,
    },

    paidVia: {
      type: String,
      enum: ["razorpay", "stripe", "cash", "upi", "card"],
      required: true,
    },

    transactionId: {
      type: String,
      trim: true,
      sparse: true,
    }, // Razorpay payment_id / Stripe payment_intent

    orderId: {
      type: String,
      trim: true,
    }, // Razorpay order_id (optional)

    /* ---------------- PAYMENT SUMMARY ---------------- */
    currency: {
      type: String,
      default: "INR",
    },

    paymentSummary: {
      serviceFee: { type: Number, required: true, min: 0 },
      discount: { type: Number, default: 0, min: 0 },
      sgst: { type: Number, default: 0, min: 0 },
      cgst: { type: Number, default: 0, min: 0 },
      totalPayable: { type: Number, required: true, min: 0 },
      refundedAmount: { type: Number, default: 0, min: 0 },
    },

    /* ---------------- STATUS ---------------- */
    paymentStatus: {
      type: String,
      enum: [
        "pending",
        "paid",
        "failed",
        "refund_initiated",
        "refunded",
        "partial_refunded",
      ],
      default: "pending",
      index: true,
    },

    paidAt: { type: Date },
    failedAt: { type: Date },
    refundedAt: { type: Date },

    /* ---------------- FAILURE INFO ---------------- */
    failureReason: {
      code: { type: String, trim: true },
      message: { type: String, trim: true },
      source: { type: String, trim: true }, // razorpay / stripe
    },

    /* ---------------- REFUNDS ---------------- */
    refunds: {
      type: [RefundSchema],
      default: [],
    },

    /* ---------------- STATUS HISTORY ---------------- */
    statusHistory: {
      type: [
        {
          status: { type: String, trim: true },
          at: { type: Date, default: Date.now },
        },
      ],
      default: [],
    },
  },
  { timestamps: false }
);

/* ---------------- INDEXES ---------------- */

// Fast queries by what the payment belongs to
PaymentSchema.index({ "paymentFor.type": 1, "paymentFor.refId": 1 });

// Prevent duplicate transactions
PaymentSchema.index({ transactionId: 1 }, { unique: true, sparse: true });

// Dashboard + listing performance
PaymentSchema.index({ userId: 1, createdAt: -1 });
PaymentSchema.index({ paymentStatus: 1, createdAt: -1 });

/* ---------------- PLUGINS ---------------- */

PaymentSchema.plugin(auditPlugin);

/* ---------------- TYPES ---------------- */

export interface IRefund {
  refundId: string;
  amount: number;
  status: "initiated" | "processing" | "succeeded" | "failed";
  reason?: string;
  initiatedAt?: Date;
  processedAt?: Date;
  providerMeta?: any;
}

export interface IPayment extends Document, IAuditFields {
  userId: mongoose.Types.ObjectId;

  paymentFor: { 
    serviceId: mongoose.Types.ObjectId;
    refId: mongoose.Types.ObjectId;
  };

  provider: "razorpay" | "stripe" | "cash";
  paidVia: "razorpay" | "stripe" | "cash" | "upi" | "card";

  transactionId?: string;
  orderId?: string;

  currency?: string;

  paymentSummary: {
    serviceFee: number;
    discount?: number;
    sgst?: number;
    cgst?: number;
    totalPayable: number;
    refundedAmount?: number;
  };

  paymentStatus:
  | "pending"
  | "paid"
  | "failed"
  | "refund_initiated"
  | "refunded"
  | "partial_refunded";

  paidAt?: Date;
  failedAt?: Date;
  refundedAt?: Date;

  failureReason?: {
    code?: string;
    message?: string;
    source?: string;
  };

  refunds?: IRefund[];

  statusHistory?: {
    status: string;
    at: Date;
  }[];
}

/* ---------------- MODEL ---------------- */

export const PaymentModel = mongoose.model<IPayment>("Payment", PaymentSchema);
export default PaymentModel;
