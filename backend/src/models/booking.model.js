import mongoose from "mongoose";

const bookingSchema = new mongoose.Schema(
  {
    bookingNumber: { type: String, required: true, unique: true, trim: true, index: true },
    customerId: { type: mongoose.Schema.Types.ObjectId, ref: "Customer", index: true },
    customerName: { type: String, required: true, trim: true },
    phone: { type: String, trim: true },
    serviceId: { type: mongoose.Schema.Types.ObjectId, ref: "Service", index: true },
    serviceName: { type: String, required: true, trim: true },
    category: { type: String, trim: true },
    scheduledDate: { type: Date },
    scheduledTime: { type: String, trim: true },
    address: { type: String, trim: true },
    partnerId: { type: mongoose.Schema.Types.ObjectId, ref: "ServicePartner", default: null },
    assignedTo: { type: String, trim: true, default: "Unassigned" },
    status: {
      type: String,
      enum: ["active", "upcoming", "completed", "cancelled", "pending_assignment", "confirmed", "in_progress"],
      default: "upcoming",
      index: true,
    },
    paymentStatus: {
      type: String,
      enum: ["pending", "partial", "paid", "under_verification"],
      default: "pending",
      index: true,
    },
    amount: { type: Number, default: 0, min: 0 },
    estimateId: { type: mongoose.Schema.Types.ObjectId, ref: "Estimate", default: null },
    invoiceId: { type: mongoose.Schema.Types.ObjectId, ref: "Invoice", default: null },
    timelineStep: { type: Number, default: 0, min: 0 },
    cancelReason: { type: String, trim: true },
    createdBy: { type: String, trim: true, default: "System" },
    emailSentAt: { type: Date, default: null },
    emailSendError: { type: String, trim: true, default: null },
  },
  { timestamps: true }
);

export const Booking = mongoose.model("Booking", bookingSchema);

export default Booking;
