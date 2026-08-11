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
  },
  {
    timestamps: true,
  }
);

enquirySchema.index({ status: 1, source: 1 });
enquirySchema.index({ customerId: 1 });
enquirySchema.index({ createdAt: -1 });

export const Enquiry = mongoose.model("Enquiry", enquirySchema);
