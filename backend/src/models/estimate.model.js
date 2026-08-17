import mongoose from "mongoose";

const lineItemSchema = new mongoose.Schema(
  {
    serviceId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Service",
      default: null,
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
    estimateNumber: {
      type: String,
      unique: true,
      // Sparse, because a unique index treats every missing value as null and
      // would reject the second document that lacks one — which is exactly what
      // any pre-existing estimate row looks like.
      sparse: true,
      trim: true,
      index: true,
    },

    // An estimate is created *from an enquiry*, before any booking or work order
    // exists — that conversion is what the estimate approval triggers. So none of
    // these three refs can be required at creation time; they get backfilled as
    // the record moves along Enquiry -> Estimate -> Booking -> Work Order.
    enquiryId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Enquiry",
      default: null,
      index: true,
    },

    bookingId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Booking",
      default: null,
      index: true,
    },

    workOrderId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Ticket",
      default: null,
      index: true,
    },

    // Denormalized display fields, matching the Booking model's convention so the
    // office table can render a row without populating three collections.
    customerName: { type: String, trim: true },
    phone: { type: String, trim: true },
    serviceName: { type: String, trim: true },
    address: { type: String, trim: true },

    // Lifecycle status, distinct from `approvalStatus` (which is the internal
    // manager sign-off). This is what the customer-facing flow moves through.
    status: {
      type: String,
      enum: [
        "Draft",
        "Pending Approval",
        "Sent",
        "Viewed",
        "Negotiation",
        "Approved",
        "Rejected",
        "Expired",
        "Converted",
        "Cancelled",
      ],
      default: "Draft",
      index: true,
    },

    validUntil: {
      type: Date,
      default: null,
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

    // Set only when a customer rejects via respondToMyEstimate — office's
    // own updateApprovalStatus flow has no equivalent concept.
    rejectReason: {
      type: String,
      trim: true,
      default: null,
    },

    pdfUrl: {
      type: String,
      trim: true,
    },

    // So "the customer says they never got it" is answerable from the record
    // instead of guessed at — set on the same request that creates/sends the
    // estimate, never by a separate follow-up call.
    emailSentAt: {
      type: Date,
      default: null,
    },

    emailSendError: {
      type: String,
      trim: true,
      default: null,
    },

    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Employee",
      default: null,
    },

    // Display name of the creator. The office UI authenticates through the admin
    // Better Auth instance, which is not an Employee document, so `createdBy`
    // cannot always be resolved to a ref.
    createdByName: {
      type: String,
      trim: true,
      default: "System",
    },
  },
  {
    timestamps: true,
  }
);

export const Estimate = mongoose.model("Estimate", estimateSchema);

export default Estimate;
