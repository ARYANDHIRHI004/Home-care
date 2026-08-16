import mongoose from "mongoose";

const internalNoteSchema = new mongoose.Schema(
  {
    text: {
      type: String,
      required: true,
      trim: true,
    },
    employeeId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Employee",
      required: true,
    },
    timestamp: {
      type: Date,
      default: Date.now,
    },
  },
  { _id: false }
);

const enquirySchema = new mongoose.Schema(
  {
    customerId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Customer",
      default: null,
    },

    source: {
      type: String,
      enum: [
        "website",
        "call",
        "whatsapp",
        "facebook",
        "instagram",
        "customer_portal",
      ],
      required: true,
    },

    serviceCategory: {
      type: String,
      required: true,
      trim: true,
    },

    description: {
      type: String,
      trim: true,
    },

    // Photos of the job itself (a leaking pipe, a broken switchboard, etc.),
    // uploaded by the customer during booking so office staff can size the
    // job before ever calling. ImageKit URLs, matching Service.images.
    images: {
      type: [String],
      default: [],
    },

    // The resolved locality name the service-area check matched against
    // (e.g. "Smriti Nagar"). Only populated for customer_portal enquiries —
    // office-created enquiries (call-in, WhatsApp, etc.) aren't restricted
    // to serviceable areas at all, so this is simply absent for those.
    locality: {
      type: String,
      trim: true,
    },

    // Full address text as entered on the booking form — locality is just
    // the matched area name used for service-area validation, this is what
    // office staff actually need to find the doorstep.
    address: {
      type: String,
      trim: true,
    },

    status: {
      type: String,
      enum: [
        "new",
        "contacted",
        "qualified",
        "converted",
        "dropped",
      ],
      default: "new",
      index: true,
    },

    assignedTo: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Employee",
      default: null,
    },

    internalNotes: [internalNoteSchema],

    linkedConversationId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Conversation",
      default: null,
    },

    // Same fire-and-record convention as Estimate/Booking/Invoice/Payment —
    // so "the customer says they never got a confirmation" is answerable
    // from the record instead of guessed at.
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

enquirySchema.index({ status: 1, source: 1 });
enquirySchema.index({ customerId: 1 });
enquirySchema.index({ createdAt: -1 });

export const Enquiry = mongoose.model("Enquiry", enquirySchema);

export default Enquiry;
