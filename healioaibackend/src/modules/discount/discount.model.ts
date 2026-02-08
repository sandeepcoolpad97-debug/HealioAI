import mongoose, { Document } from "mongoose";
import { auditPlugin } from "../../common/schemas/audit.schema";
import { IAuditFields } from "../../common/types/audit.types";

/* ---------------- DISCOUNT SCHEMA ---------------- */
const DiscountSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },

    description: { type: String, trim: true }, // optional

    price: { type: Number, required: true, min: 0 }, // discount amount

    // ---------------- LINK TO SERVICE ----------------
    serviceId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Service",
      required: true,
      index: true,
    },

    // ---------------- RULES ----------------
    rule: { 
      type: mongoose.Schema.Types.Mixed, // store JSON rules like { minAmount: 1000, firstTimeUser: true }
      required: true,
      default: {},
    },
  },
  { timestamps: false } // handled by auditPlugin
);

/* ---------------- PLUGINS ---------------- */
DiscountSchema.plugin(auditPlugin);

/* ---------------- INTERFACE ---------------- */
export interface IDiscount extends Document, IAuditFields {
  name: string;
  description?: string;
  price: number;
  serviceId: mongoose.Types.ObjectId;
  rule: {
    [key: string]: any;
  };
}

/* ---------------- MODEL ---------------- */
export const DiscountModel = mongoose.model<IDiscount>("Discount", DiscountSchema);
export default DiscountModel;
