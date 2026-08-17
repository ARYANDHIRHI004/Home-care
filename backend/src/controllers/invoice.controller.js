import Invoice from "../models/invoice.model.js";
import Ticket from "../models/ticket.model.js";
import { sendEmail } from "../utils/mailer.js";
import { buildInvoiceEmailHtml } from "../emails/invoiceEmail.js";
import { resolveCustomerFromInvoice, resolveCustomerIdForSession } from "../utils/resolveCustomer.js";
import { env } from "../utils/env.js";

// Fire-and-record, same pattern as estimates — a failed send must not undo
// the invoice that was just created, it just gets logged on the document.
const trySendInvoiceEmail = async (invoice) => {
  const customer = await resolveCustomerFromInvoice(invoice);
  if (!customer?.email) return; // phone-only signups are valid, just skip this leg

  try {
    const dashboardUrl = `${env.CUSTOMER_APP_URL}/customer/invoices/${invoice._id}/preview`;
    const html = buildInvoiceEmailHtml({ invoice, customer, dashboardUrl });
    await sendEmail({
      to: customer.email,
      subject: `Your invoice ${invoice.invoiceNumber || ""} from HomeCare247`.trim(),
      html,
    });
    invoice.emailSentAt = new Date();
    invoice.emailSendError = null;
  } catch (error) {
    invoice.emailSentAt = null;
    invoice.emailSendError = error.message || "Unknown error sending email";
  }
  await invoice.save();
};

const generateInvoiceNumber = () => {
  const year = new Date().getFullYear();
  const random = Math.floor(1000 + Math.random() * 9000);
  return `INV-${year}-${random}`;
};

const calculateTotal = (lineItems = [], tax = 0, discount = 0) => {
  const subtotal = lineItems.reduce(
    (sum, item) => sum + Number(item.qty || 0) * Number(item.price || 0), 0
  );
  return subtotal + Number(tax || 0) - Number(discount || 0);
};

export const createInvoice = async (req, res) => {
  try {
    const invoice = await Invoice.create({
      ...req.body,
      invoiceNumber: req.body.invoiceNumber || generateInvoiceNumber(),
      total: calculateTotal(req.body.lineItems, req.body.tax, req.body.discount),
      paymentStatus: "unpaid",
      sentViaWhatsApp: false,
    });

    // Same request that creates the invoice — no separate "now email it" call.
    await trySendInvoiceEmail(invoice);

    res.status(201).json(invoice);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Customer-scoped counterpart to getMyInvoices, for the dashboard link the
// invoice email points at — the generic getInvoiceById below is gated behind
// a staff-only permission, so a logged-in customer needs its own route that
// also proves the invoice actually belongs to them.
export const getMyInvoiceById = async (req, res) => {
  try {
    const customerId = await resolveCustomerIdForSession(req);
    if (!customerId) return res.status(404).json({ message: "Invoice not found" });

    const invoice = await Invoice.findById(req.params.id).populate("workOrderId", "customerId");
    if (!invoice) return res.status(404).json({ message: "Invoice not found" });

    const ownerCustomerId = invoice.workOrderId?.customerId;
    if (!ownerCustomerId || String(ownerCustomerId) !== String(customerId)) {
      return res.status(404).json({ message: "Invoice not found" });
    }

    res.json(invoice);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getInvoices = async (req, res) => {
  try {
    const filter = {};
    // The schema field is workOrderId (a Ticket ref), not ticketId — this
    // was filtering/populating a path that doesn't exist on the model, so
    // populate() silently no-opped and every invoice list row showed
    // "Unknown" customer / "—" booking regardless of real data.
    if (req.query.workOrderId) filter.workOrderId = req.query.workOrderId;
    if (req.query.paymentStatus) filter.paymentStatus = req.query.paymentStatus;

    res.json(
      await Invoice.find(filter)
        .populate({ path: "workOrderId", select: "ticketNumber status customerId customerName", populate: { path: "customerId", select: "name phone" } })
        .sort({ createdAt: -1 })
    );
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getMyInvoices = async (req, res) => {
  try {
    const customerId = await resolveCustomerIdForSession(req);
    if (!customerId) return res.json([]);

    const workOrders = await Ticket.find({ customerId }).select("_id");
    if (workOrders.length === 0) return res.json([]);
    const filter = { workOrderId: { $in: workOrders.map(t => t._id) } };
    
    const invoices = await Invoice.find(filter)
      .populate({
        path: "workOrderId",
        select: "ticketNumber status customerName",
      })
      .sort({ createdAt: -1 });

    res.json(invoices);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getInvoiceById = async (req, res) => {
  try {
    const invoice = await Invoice.findById(req.params.id)
      .populate({ path: "workOrderId", populate: { path: "customerId", select: "name phone email" } });
    if (!invoice) return res.status(404).json({ message: "Invoice not found" });
    res.json(invoice);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const updateInvoice = async (req, res) => {
  try {
    const data = { ...req.body };
    // Same reason createEstimate/updateEstimate recompute `total` on any
    // line-item change — leaving the stored total stale after editing
    // lineItems/tax/discount would silently desync it from what the
    // invoice actually itemizes.
    if (data.lineItems || data.tax !== undefined || data.discount !== undefined) {
      const before = await Invoice.findById(req.params.id).select("lineItems tax discount").lean();
      if (!before) return res.status(404).json({ message: "Invoice not found" });
      data.total = calculateTotal(
        data.lineItems ?? before.lineItems,
        data.tax ?? before.tax,
        data.discount ?? before.discount
      );
    }

    const invoice = await Invoice.findByIdAndUpdate(
      req.params.id, data, { new: true, runValidators: true }
    );
    if (!invoice) return res.status(404).json({ message: "Invoice not found" });
    res.json(invoice);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

export const updatePaymentStatus = async (req, res) => {
  try {
    const invoice = await Invoice.findByIdAndUpdate(
      req.params.id, { paymentStatus: req.body.paymentStatus }, { new: true }
    );
    if (!invoice) return res.status(404).json({ message: "Invoice not found" });
    res.json(invoice);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

export const markWhatsAppSent = async (req, res) => {
  try {
    const invoice = await Invoice.findByIdAndUpdate(
      req.params.id, { sentViaWhatsApp: true }, { new: true }
    );
    if (!invoice) return res.status(404).json({ message: "Invoice not found" });
    res.json(invoice);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const deleteInvoice = async (req, res) => {
  try {
    const invoice = await Invoice.findByIdAndDelete(req.params.id);
    if (!invoice) return res.status(404).json({ message: "Invoice not found" });
    res.json({ message: "Invoice deleted" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

import { generateInvoicePdfBuffer } from "../utils/generateInvoicePdf.js";

export const downloadInvoicePdf = async (req, res) => {
  try {
    const invoice = await Invoice.findById(req.params.id)
      .populate({ path: "workOrderId", populate: { path: "customerId", select: "name phone email" } });
      
    if (!invoice) return res.status(404).json({ message: "Invoice not found" });

    const pdfBuffer = await generateInvoicePdfBuffer(invoice.toObject ? invoice.toObject() : invoice);

    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', `attachment; filename=invoice-${invoice.invoiceNumber || invoice._id}.pdf`);
    res.send(pdfBuffer);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const sendInvoiceEmailWithPdf = async (req, res) => {
  try {
    const invoice = await Invoice.findById(req.params.id)
      .populate({ path: "workOrderId", populate: { path: "customerId", select: "name phone email" } });

    if (!invoice) return res.status(404).json({ message: "Invoice not found" });

    const customer = await resolveCustomerFromInvoice(invoice);
    if (!customer?.email) {
      return res.status(200).json({ message: "No email on file — share the download link via WhatsApp instead." });
    }

    const pdfBuffer = await generateInvoicePdfBuffer(invoice.toObject ? invoice.toObject() : invoice);
    const dashboardUrl = `${env.CUSTOMER_APP_URL}/customer/invoices/${invoice._id}/preview`;
    
    const html = `<p>Hi ${customer.name || 'Customer'},</p><p>Please find your invoice <strong>${invoice.invoiceNumber || invoice._id}</strong> attached.</p><p>You can also view it online here: <a href="${dashboardUrl}">View Invoice</a></p>`;

    try {
      await sendEmail({
        to: customer.email,
        subject: `Invoice ${invoice.invoiceNumber || invoice._id} from HomeCare247`,
        html,
        attachments: [{ filename: `invoice-${invoice.invoiceNumber || invoice._id}.pdf`, content: pdfBuffer }],
      });
      
      invoice.emailSentAt = new Date();
      invoice.emailSendError = null;
      await invoice.save();
      
      res.json({ message: `Sent to ${customer.email}` });
    } catch (emailError) {
      invoice.emailSentAt = null;
      invoice.emailSendError = emailError.message || "Unknown error sending email";
      await invoice.save();
      throw emailError;
    }

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
