import mongoose from "mongoose";

const couponSchema = new mongoose.Schema(
  {
    code: { type: String, required: true, unique: true, uppercase: true, trim: true, index: true },
    campaign: { type: String, required: true, trim: true },
    type: {
      type: String,
      enum: ["percentage", "flat", "free_visit"],
      required: true,
    },
    discountValue: { type: Number, default: 0, min: 0 },
    services: { type: String, default: "All Services", trim: true },
    usageCount: { type: Number, default: 0, min: 0 },
    usageLimit: { type: Number, default: null, min: 1 },
    startsAt: { type: Date, default: null },
    expiresAt: { type: Date, default: null },
    status: {
      type: String,
      enum: ["active", "scheduled", "paused", "expired", "archived"],
      default: "active",
      index: true,
    },
    createdBy: { type: String, default: "Admin", trim: true },
  },
  { timestamps: true }
);

export const Coupon = mongoose.model("Coupon", couponSchema);

export default Coupon;
