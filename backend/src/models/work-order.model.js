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

    address: {
      type: String,
      trim: true,
    },

    // Full field-execution state machine: open -> assigned -> accepted ->
    // on_route -> in_progress -> completed -> invoiced -> paid, with a
    // declined -> (reassign) branch back to open. estimate_sent/approved are
    // kept for backward compatibility with any pre-existing records but are
    // not reachable through the current create/assign/status flow.
    status: {
      type: String,
      enum: [
        "open",
        "estimate_sent",
        "approved",
        "assigned",
        "accepted",
        "on_route",
        "in_progress",
        "completed",
        "invoiced",
        "paid",
        "declined",
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

    // Set when a partner declines an assignment (status -> 'declined').
    // Cleared automatically the next time this work order is (re)assigned.
    declineReason: {
      type: String,
      trim: true,
      default: null,
    },

    // Invoice.workOrderId refs the Ticket collection, not this one — Invoice
    // and Complaints share the Ticket model, while WorkOrder is the separate
    // collection this "Work Orders" ERP module actually uses. Rather than
    // migrating Invoice's ref (a bigger, riskier change), completing a
    // WorkOrder auto-creates/links a completed Ticket so it becomes
    // selectable in the Invoices module without duplicating on repeat calls.
    linkedTicketId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Ticket",
      default: null,
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
