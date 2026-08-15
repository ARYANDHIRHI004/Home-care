import mongoose from "mongoose";

const notificationSchema = new mongoose.Schema(
  {
    recipientId: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      index: true,
    },
    recipientType: {
      type: String,
      enum: ["customer", "partner", "employee"],
      required: true,
    },
    channel: {
      type: String,
      enum: ["sms", "whatsapp", "email", "push"],
      required: true,
    },
    subject: { type: String, trim: true },
    message: { type: String, required: true },
    status: {
      type: String,
      enum: ["queued", "sent", "failed"],
      default: "queued",
      index: true,
    },
    sentAt: { type: Date },
  },
  {
    timestamps: true,
  }
);

export const Notification = mongoose.model("Notification", notificationSchema);
export default Notification;
