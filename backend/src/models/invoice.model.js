import mongoose from "mongoose";

const lineItemSchema = new mongoose.Schema(
  {
    serviceId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Service",
      required: true,
    },

    name: {
      type: String,
      required: true,
      trim: true,
    },

    qty: {
      type: Number,
      required: true,
      min: 1,
    },

    price: {
      type: Number,
      required: true,
      min: 0,
    },
  },
  { _id: false }
);

const invoiceSchema = new mongoose.Schema(
  {
    workOrderId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Ticket",
      required: true,
      index: true,
    },

    invoiceNumber: {
      type: String,
      required: true,
      unique: true,
      index: true,
      trim: true,
    },

    lineItems: {
      type: [lineItemSchema],
      default: [],
    },

    tax: {
      type: Number,
      default: 0,
      min: 0,
    },

    discount: {
      type: Number,
      default: 0,
      min: 0,
    },

    total: {
      type: Number,
      required: true,
      min: 0,
    },

    paymentStatus: {
      type: String,
      enum: ["unpaid", "partial", "paid"],
      default: "unpaid",
      index: true,
    },

    pdfUrl: {
      type: String,
      trim: true,
    },

    sentViaWhatsApp: {
      type: Boolean,
      default: false,
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

export const Invoice = mongoose.model("Invoice", invoiceSchema);

export default Invoice;
