import mongoose from "mongoose";

const messageSchema = new mongoose.Schema(
  {
    from: {
      type: String,
      enum: ["bot", "customer", "employee"],
      required: true,
    },

    text: {
      type: String,
      required: true,
    },

    timestamp: {
      type: Date,
      default: Date.now,
    },
  },
  { _id: false }
);

const conversationSchema = new mongoose.Schema(
  {
    customerId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Customer",
      default: null,
    },

    channel: {
      type: String,
      enum: ["whatsapp", "facebook", "instagram"],
      required: true,
    },

    externalThreadId: {
      type: String,
      required: true,
      trim: true,
    },

    messages: {
      type: [messageSchema],
      default: [],
    },

    linkedEnquiryId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Enquiry",
      default: null,
    },

    status: {
      type: String,
      enum: [
        "bot_active",
        "awaiting_human",
        "human_active",
        "resolved",
      ],
      default: "bot_active",
    },
  },
  {
    timestamps: true,
  }
);

conversationSchema.index(
  { channel: 1, externalThreadId: 1 },
  { unique: true }
);

conversationSchema.index({ status: 1 });
conversationSchema.index({ customerId: 1 });

module.exports = mongoose.model(
  "Conversation",
  conversationSchema
);
