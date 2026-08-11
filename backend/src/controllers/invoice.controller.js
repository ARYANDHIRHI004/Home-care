import Invoice from "../models/invoice.model.js";

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

    res.status(201).json(invoice);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

export const getInvoices = async (req, res) => {
  try {
    const filter = {};
    if (req.query.ticketId) filter.ticketId = req.query.ticketId;
    if (req.query.paymentStatus) filter.paymentStatus = req.query.paymentStatus;

    res.json(
      await Invoice.find(filter).populate("ticketId").sort({ createdAt: -1 })
    );
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getInvoiceById = async (req, res) => {
  try {
    const invoice = await Invoice.findById(req.params.id).populate("ticketId");
    if (!invoice) return res.status(404).json({ message: "Invoice not found" });
    res.json(invoice);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const updateInvoice = async (req, res) => {
  try {
    const invoice = await Invoice.findByIdAndUpdate(
      req.params.id, req.body, { new: true, runValidators: true }
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
