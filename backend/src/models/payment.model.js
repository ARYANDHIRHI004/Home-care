import mongoose from "mongoose";

const paymentSchema = new mongoose.Schema(
  {
    invoiceId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Invoice",
      required: true,
      index: true,
    },

    method: {
      type: String,
      enum: ["cash", "upi", "razorpay"],
      required: true,
    },

    amount: {
      type: Number,
      required: true,
      min: 0.01,
    },

    status: {
      type: String,
      enum: ["pending", "verified", "failed"],
      default: "pending",
    },

    razorpayTxnId: {
      type: String,
      trim: true,
      sparse: true,
    },

    verifiedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Employee",
      default: null,
    },

    emailSentAt: {
      type: Date,
      default: null,
    },

    emailSendError: {
      type: String,
      trim: true,
      default: null,
    },
  },
  {
    timestamps: true,
  }
);

export const Payment = mongoose.model("Payment", paymentSchema);

export default Payment;
