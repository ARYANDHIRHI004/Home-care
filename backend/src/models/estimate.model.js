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

const acceptedTermsSchema = new mongoose.Schema(
  {
    termsId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "TermsAndCondition",
      required: true,
    },

    version: {
      type: Number,
      required: true,
    },

    acceptedAt: {
      type: Date,
      required: true,
    },
  },
  { _id: false }
);

const estimateSchema = new mongoose.Schema(
  {
    workOrderId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Ticket",
      required: true,
      index: true,
    },

    lineItems: {
      type: [lineItemSchema],
      default: [],
    },

    visitCharges: {
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

    approvalStatus: {
      type: String,
      enum: ["pending", "approved", "rejected"],
      default: "pending",
    },

    acceptedTerms: {
      type: acceptedTermsSchema,
      default: null,
    },

    pdfUrl: {
      type: String,
      trim: true,
    },

    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Employee",
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

export const Estimate = mongoose.model("Estimate", estimateSchema);

export default Estimate;
