import Payment from "../models/payment.model.js";
import Ticket from "../models/ticket.model.js";
import Invoice from "../models/invoice.model.js";
import { sendEmail } from "../utils/mailer.js";
import { buildStatusUpdateEmailHtml } from "../emails/statusUpdateEmail.js";
import { resolveCustomerFromInvoice, resolveCustomerIdForSession } from "../utils/resolveCustomer.js";
import { notifyCustomer } from "./notification.controller.js";
import { env } from "../utils/env.js";

// Fire-and-record, same pattern as the other three email types — a failed
// send must not undo the verification that was just recorded.
const trySendPaymentVerifiedEmail = async (payment, invoice) => {
  const customer = await resolveCustomerFromInvoice(invoice);
  if (!customer) return;

  await notifyCustomer({
    customerId: customer._id,
    type: "payment_verified",
    message: `Your payment of ₹${Number(payment.amount || 0).toLocaleString("en-IN")} for invoice ${invoice.invoiceNumber || ""} has been verified.`.trim(),
  });

  if (!customer.email) return; // phone-only signups are valid, just skip the email leg

  try {
    const dashboardUrl = `${env.CUSTOMER_APP_URL}/customer/invoices`;
    const html = buildStatusUpdateEmailHtml({
      customerName: customer.name,
      headline: "Payment verified",
      detail: `We've confirmed your payment of Rs. ${Number(payment.amount || 0).toLocaleString("en-IN")} for invoice ${invoice.invoiceNumber || ""}. It now shows as ${invoice.paymentStatus === "paid" ? "Paid" : "updated"} on your dashboard.`,
      dashboardUrl,
      ctaLabel: "View Invoices",
    });
    await sendEmail({
      to: customer.email,
      subject: `Payment verified — ${invoice.invoiceNumber || ""}`.trim(),
      html,
    });
    payment.emailSentAt = new Date();
    payment.emailSendError = null;
  } catch (error) {
    payment.emailSentAt = null;
    payment.emailSendError = error.message || "Unknown error sending email";
  }
  await payment.save();
};

export const createPayment = async (req, res) => {
  try {
    const payment = await Payment.create({
      ...req.body,
      status: req.body.status || "pending",
    });
    res.status(201).json(payment);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

export const getPayments = async (req, res) => {
  try {
    const filter = {};
    if (req.query.invoiceId) filter.invoiceId = req.query.invoiceId;
    if (req.query.status) filter.status = req.query.status;

    res.json(
      await Payment.find(filter)
        .populate("invoiceId", "invoiceNumber total")
        .populate("verifiedBy", "name")
        .sort({ createdAt: -1 })
    );
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getMyPayments = async (req, res) => {
  try {
    const customerId = await resolveCustomerIdForSession(req);
    if (!customerId) return res.json([]);

    const workOrders = await Ticket.find({ customerId }).select("_id");
    if (workOrders.length === 0) return res.json([]);
    const invoices = await Invoice.find({ workOrderId: { $in: workOrders.map(t => t._id) } }).select("_id");
    if (invoices.length === 0) return res.json([]);
    const filter = { invoiceId: { $in: invoices.map(i => i._id) } };

    res.json(
      await Payment.find(filter)
        .populate("invoiceId", "invoiceNumber total")
        .sort({ createdAt: -1 })
    );
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const verifyPayment = async (req, res) => {
  try {
    const payment = await Payment.findByIdAndUpdate(
      req.params.id,
      { status: "verified", verifiedBy: req.body.verifiedBy },
      { new: true }
    );

    if (!payment) return res.status(404).json({ message: "Payment not found" });

    const payments = await Payment.find({
      invoiceId: payment.invoiceId,
      status: "verified",
    });

    const invoice = await Invoice.findById(payment.invoiceId);
    if (invoice) {
      const paid = payments.reduce((sum, p) => sum + Number(p.amount || 0), 0);
      invoice.paymentStatus = paid >= invoice.total ? "paid" : paid > 0 ? "partial" : "unpaid";
      await invoice.save();
      await trySendPaymentVerifiedEmail(payment, invoice);
    }

    res.json(payment);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

export const updatePayment = async (req, res) => {
  try {
    const payment = await Payment.findByIdAndUpdate(
      req.params.id, req.body, { new: true, runValidators: true }
    );
    if (!payment) return res.status(404).json({ message: "Payment not found" });
    res.json(payment);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

export const deletePayment = async (req, res) => {
  try {
    const payment = await Payment.findByIdAndDelete(req.params.id);
    if (!payment) return res.status(404).json({ message: "Payment not found" });
    res.json({ message: "Payment deleted" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
