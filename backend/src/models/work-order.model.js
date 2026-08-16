import mongoose from "mongoose";

const timelineSchema = new mongoose.Schema(
  {
    status: {
      type: String,
      required: true,
    },
    timestamp: {
      type: Date,
      default: Date.now,
    },
    byEmployeeId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Employee",
    },
  },
  { _id: false }
);

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

const workOrderSchema = new mongoose.Schema(
  {
    workOrderNumber: {
      type: String,
      required: true,
      unique: true,
      index: true,
      trim: true,
    },

    enquiryId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Enquiry",
      required: true,
    },

    customerId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Customer",
      required: true,
      index: true,
    },

    // Optional dashboard denormalization
    customerName: {
      type: String,
      trim: true,
    },

    customerPhone: {
      type: String,
      trim: true,
    },

    status: {
      type: String,
      enum: [
        "open",
        "estimate_sent",
        "approved",
        "assigned",
        "in_progress",
        "completed",
        "closed",
      ],
      default: "open",
      index: true,
    },

    priority: {
      type: String,
      enum: ["low", "normal", "high"],
      default: "normal",
    },

    assignedPartnerId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "ServicePartner",
      default: null,
      index: true,
    },

    timeline: [timelineSchema],

    internalNotes: [internalNoteSchema],

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

export const WorkOrder = mongoose.models.WorkOrder || mongoose.model("WorkOrder", workOrderSchema);

export default WorkOrder;
