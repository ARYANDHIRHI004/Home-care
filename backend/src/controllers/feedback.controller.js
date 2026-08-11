import Feedback from "../models/feedback.model.js";
import Customer from "../models/customer.model.js";

export const createFeedback = async (req, res) => {
  try {
    const feedback = await Feedback.create(req.body);

    const allFeedback = await Feedback.find({ customerId: feedback.customerId });
    const avg =
      allFeedback.reduce((sum, item) => sum + Number(item.rating), 0) /
      allFeedback.length;

    await Customer.findByIdAndUpdate(feedback.customerId, {
      feedbackAvg: Number(avg.toFixed(2)),
    });

    res.status(201).json(feedback);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

export const getFeedback = async (req, res) => {
  try {
    const filter = {};
    if (req.query.ticketId) filter.ticketId = req.query.ticketId;
    if (req.query.customerId) filter.customerId = req.query.customerId;

    res.json(
      await Feedback.find(filter)
        .populate("ticketId")
        .populate("customerId", "name phone")
        .sort({ createdAt: -1 })
    );
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getFeedbackById = async (req, res) => {
  try {
    const feedback = await Feedback.findById(req.params.id)
      .populate("ticketId")
      .populate("customerId");

    if (!feedback) return res.status(404).json({ message: "Feedback not found" });
    res.json(feedback);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const deleteFeedback = async (req, res) => {
  try {
    const feedback = await Feedback.findByIdAndDelete(req.params.id);
    if (!feedback) return res.status(404).json({ message: "Feedback not found" });
    res.json({ message: "Feedback deleted" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
