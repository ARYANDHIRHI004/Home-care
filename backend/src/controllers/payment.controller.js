import Payment from "../models/payment.model.js";
import Invoice from "../models/invoice.model.js";

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
        .populate("invoiceId")
        .populate("verifiedBy", "name email")
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
