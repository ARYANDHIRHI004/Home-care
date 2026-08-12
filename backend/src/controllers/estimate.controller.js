import {Estimate} from "../models/estimate.models.js";

const calculateTotal = (lineItems = [], visitCharges = 0, discount = 0) => {
  const subtotal = lineItems.reduce(
    (sum, item) => sum + Number(item.qty || 0) * Number(item.price || 0), 0
  );
  return subtotal + Number(visitCharges || 0) - Number(discount || 0);
};

export const createEstimate = async (req, res) => {
  try {
    const total = calculateTotal(
      req.body.lineItems,
      req.body.visitCharges,
      req.body.discount
    );

    const estimate = await Estimate.create({
      ...req.body,
      total,
      approvalStatus: "pending",
    });

    res.status(201).json(estimate);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

export const getEstimates = async (req, res) => {
  try {
    const filter = {};
    if (req.query.ticketId) filter.ticketId = req.query.ticketId;
    if (req.query.approvalStatus) filter.approvalStatus = req.query.approvalStatus;

    res.json(
      await Estimate.find(filter)
        .populate("ticketId")
        .populate("createdBy", "name email")
        .sort({ createdAt: -1 })
    );
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getEstimateById = async (req, res) => {
  try {
    const estimate = await Estimate.findById(req.params.id)
      .populate("ticketId")
      .populate("createdBy", "name email");

    if (!estimate) return res.status(404).json({ message: "Estimate not found" });
    res.json(estimate);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const updateEstimate = async (req, res) => {
  try {
    const data = { ...req.body };
    if (data.lineItems || data.visitCharges !== undefined || data.discount !== undefined) {
      data.total = calculateTotal(
        data.lineItems || [],
        data.visitCharges || 0,
        data.discount || 0
      );
    }

    const estimate = await Estimate.findByIdAndUpdate(
      req.params.id, data, { new: true, runValidators: true }
    );

    if (!estimate) return res.status(404).json({ message: "Estimate not found" });
    res.json(estimate);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

export const updateApprovalStatus = async (req, res) => {
  try {
    const { approvalStatus, acceptedTerms } = req.body;
    const update = { approvalStatus };

    if (approvalStatus === "approved" && acceptedTerms) {
      update.acceptedTerms = { ...acceptedTerms, acceptedAt: new Date() };
    }

    const estimate = await Estimate.findByIdAndUpdate(
      req.params.id, update, { new: true }
    );

    if (!estimate) return res.status(404).json({ message: "Estimate not found" });
    res.json(estimate);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

export const deleteEstimate = async (req, res) => {
  try {
    const estimate = await Estimate.findByIdAndDelete(req.params.id);
    if (!estimate) return res.status(404).json({ message: "Estimate not found" });
    res.json({ message: "Estimate deleted" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
