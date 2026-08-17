import WorkOrder from "../models/work-order.model.js";
import Enquiry from "../models/enquiry.model.js";
import ServicePartner from "../models/servicePartner.model.js";
import Ticket from "../models/ticket.model.js";
import { sendEmail } from "../utils/mailer.js";
import { buildStatusUpdateEmailHtml } from "../emails/statusUpdateEmail.js";
import { resolveCustomerFromWorkOrder } from "../utils/resolveCustomer.js";
import { notifyCustomer } from "./notification.controller.js";
import { env } from "../utils/env.js";

// Fire-and-record, same pattern as the estimate/invoice emails — a failed
// send must not undo the assignment that was just made.
const trySendPartnerAssignedEmail = async (workOrder, partnerName) => {
  const customer = await resolveCustomerFromWorkOrder(workOrder);
  if (!customer) return;

  await notifyCustomer({
    customerId: customer._id,
    type: "partner_assigned",
    message: `${partnerName || "A professional"} has been assigned to your request ${workOrder.workOrderNumber}.`,
  });

  if (!customer.email) return; // phone-only signups are valid, just skip the email leg

  try {
    const dashboardUrl = `${env.CUSTOMER_APP_URL}/customer/services`;
    const html = buildStatusUpdateEmailHtml({
      customerName: customer.name || workOrder.customerName,
      headline: "A professional has been assigned",
      detail: `${partnerName || "Our team"} will be handling your request (${workOrder.workOrderNumber}). Check your dashboard for updates.`,
      dashboardUrl,
      ctaLabel: "View My Services",
    });
    await sendEmail({
      to: customer.email,
      subject: `Professional assigned — ${workOrder.workOrderNumber}`,
      html,
    });
    workOrder.emailSentAt = new Date();
    workOrder.emailSendError = null;
  } catch (error) {
    workOrder.emailSentAt = null;
    workOrder.emailSendError = error.message || "Unknown error sending email";
  }
  await workOrder.save();
};

// Valid next states from each status — enforced here, not just in the
// frontend's restricted option list, since a direct API call could still
// send an illegal jump (e.g. straight from 'assigned' to 'completed').
const STATUS_TRANSITIONS = {
  open: ["assigned"],
  assigned: ["accepted", "declined"],
  accepted: ["on_route"],
  on_route: ["in_progress"],
  in_progress: ["completed"],
  completed: ["invoiced"],
  invoiced: ["paid"],
  declined: ["assigned"],
  paid: [],
  closed: [],
  // Legacy states, kept reachable only via direct assignment, not this map.
  estimate_sent: [],
  approved: [],
};

const generateWorkOrderNumber = () => {
  const year = new Date().getFullYear();
  const random = Math.floor(1000 + Math.random() * 9000);
  return `WO-${year}-${random}`;
};

const generateTicketNumber = () => {
  const year = new Date().getFullYear();
  const random = Math.floor(1000 + Math.random() * 9000);
  return `TCK-${year}-${random}`;
};

// Invoice.workOrderId refs Ticket, not WorkOrder — see the linkedTicketId
// comment in work-order.model.js. Called once, the moment a work order first
// becomes 'completed', so it's selectable in the Invoices module's
// completed-order picker without a bigger migration of Invoice's ref.
const ensureLinkedTicketForCompletion = async (workOrder) => {
  if (workOrder.linkedTicketId) return;

  const ticket = await Ticket.create({
    ticketNumber: generateTicketNumber(),
    enquiryId: workOrder.enquiryId,
    customerId: workOrder.customerId,
    customerName: workOrder.customerName,
    customerPhone: workOrder.customerPhone,
    priority: ["low", "normal", "high"].includes(workOrder.priority) ? workOrder.priority : "normal",
    assignedPartnerId: workOrder.assignedPartnerId,
    status: "completed",
    timeline: [{ status: "completed", timestamp: new Date() }],
  });

  workOrder.linkedTicketId = ticket._id;
  await workOrder.save();
};

export const createWorkOrder = async (req, res) => {
  try {
    const { enquiryId, customerId, byEmployeeId } = req.body;

    if (!enquiryId || !customerId)
      return res.status(400).json({ message: "enquiryId and customerId are required" });

    let address = req.body.address;
    if (!address) {
      const enq = await Enquiry.findById(enquiryId);
      if (enq?.address) address = enq.address;
    }

    const workOrder = await WorkOrder.create({
      ...req.body,
      address,
      workOrderNumber: req.body.workOrderNumber || generateWorkOrderNumber(),
      status: "open",
      timeline: [{ status: "open", timestamp: new Date(), byEmployeeId }],
    });

    await Enquiry.findByIdAndUpdate(enquiryId, { status: "converted" });
    res.status(201).json(workOrder);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

export const getWorkOrders = async (req, res) => {
  try {
    const filter = {};
    if (req.query.status) filter.status = req.query.status;
    if (req.query.priority) filter.priority = req.query.priority;
    if (req.query.assignedPartnerId) filter.assignedPartnerId = req.query.assignedPartnerId;
    if (req.query.customerId) filter.customerId = req.query.customerId;

    const workOrders = await WorkOrder.find(filter)
      .populate("customerId", "name phone email addresses")
      .populate("enquiryId", "address serviceCategory")
      .populate("assignedPartnerId", "name phone skills avgRating")
      .sort({ createdAt: -1 });

    res.json(workOrders);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getWorkOrderById = async (req, res) => {
  try {
    const workOrder = await WorkOrder.findById(req.params.id)
      .populate("customerId")
      .populate("enquiryId")
      .populate("assignedPartnerId");

    if (!workOrder) return res.status(404).json({ message: "Work order not found" });
    res.json(workOrder);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const updateWorkOrderStatus = async (req, res) => {
  try {
    const { status, byEmployeeId, declineReason } = req.body;
    if (!status) return res.status(400).json({ message: "status is required" });

    const current = await WorkOrder.findById(req.params.id).select("status");
    if (!current) return res.status(404).json({ message: "Work order not found" });

    const allowedNext = STATUS_TRANSITIONS[current.status] || [];
    if (!allowedNext.includes(status)) {
      return res.status(400).json({
        message: `Cannot move a work order from '${current.status}' to '${status}'. Valid next state(s): ${allowedNext.join(", ") || "none"}.`,
      });
    }

    if (status === "declined" && !declineReason) {
      return res.status(400).json({ message: "declineReason is required when declining a work order" });
    }

    const workOrder = await WorkOrder.findByIdAndUpdate(
      req.params.id,
      {
        status,
        declineReason: status === "declined" ? declineReason : null,
        $push: { timeline: { status, timestamp: new Date(), byEmployeeId } },
      },
      { new: true }
    );

    if (!workOrder) return res.status(404).json({ message: "Work order not found" });

    if (status === "completed") {
      await ensureLinkedTicketForCompletion(workOrder);
    }

    res.json(workOrder);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

export const assignPartner = async (req, res) => {
  try {
    const { assignedPartnerId, byEmployeeId } = req.body;

    const workOrder = await WorkOrder.findByIdAndUpdate(
      req.params.id,
      {
        assignedPartnerId,
        status: "assigned",
        declineReason: null,
        $push: {
          timeline: { status: "assigned", timestamp: new Date(), byEmployeeId },
        },
      },
      { new: true }
    );

    if (!workOrder) return res.status(404).json({ message: "Work order not found" });

    const partner = assignedPartnerId
      ? await ServicePartner.findById(assignedPartnerId).select("name").lean()
      : null;
    await trySendPartnerAssignedEmail(workOrder, partner?.name);

    res.json(workOrder);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

export const addWorkOrderNote = async (req, res) => {
  try {
    const { text, employeeId } = req.body;
    const workOrder = await WorkOrder.findByIdAndUpdate(
      req.params.id,
      { $push: { internalNotes: { text, employeeId, timestamp: new Date() } } },
      { new: true }
    );

    if (!workOrder) return res.status(404).json({ message: "Work order not found" });
    res.json(workOrder);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const deleteWorkOrder = async (req, res) => {
  try {
    const workOrder = await WorkOrder.findByIdAndDelete(req.params.id);
    if (!workOrder) return res.status(404).json({ message: "Work order not found" });
    res.json({ message: "Work order deleted" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
