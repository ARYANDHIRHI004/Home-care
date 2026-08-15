import Enquiry from "../models/enquiry.model.js";
import Customer from "../models/customer.model.js";

export const createEnquiry = async (req, res) => {
  try {
    const { name, phone, email, source, serviceCategory, description, ...rest } = req.body;

    let customer = phone ? await Customer.findOne({ phone }) : null;

    if (!customer && phone) {
      customer = await Customer.create({
        name,
        phone,
        email,
        otpVerified: false,
        registrationChannel: "call",
      });
    }

    const enquiry = await Enquiry.create({
      ...rest,
      customerId: customer?._id,
      source,
      serviceCategory,
      description,
    });

    res.status(201).json(enquiry);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

export const getEnquiries = async (req, res) => {
  try {
    const filter = {};
    if (req.query.status) filter.status = req.query.status;
    if (req.query.source) filter.source = req.query.source;
    if (req.query.customerId) filter.customerId = req.query.customerId;
    if (req.query.assignedTo) filter.assignedTo = req.query.assignedTo;

    const enquiries = await Enquiry.find(filter)
      .populate("customerId", "name phone email")
      .populate("assignedTo", "name email")
      .sort({ createdAt: -1 });

    res.json(enquiries);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getEnquiryById = async (req, res) => {
  try {
    const enquiry = await Enquiry.findById(req.params.id)
      .populate("customerId")
      .populate("assignedTo", "name email");

    if (!enquiry) return res.status(404).json({ message: "Enquiry not found" });
    res.json(enquiry);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const updateEnquiry = async (req, res) => {
  try {
    const enquiry = await Enquiry.findByIdAndUpdate(
      req.params.id, req.body, { new: true, runValidators: true }
    );
    if (!enquiry) return res.status(404).json({ message: "Enquiry not found" });
    res.json(enquiry);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

export const addEnquiryNote = async (req, res) => {
  try {
    const { text, employeeId } = req.body;
    const enquiry = await Enquiry.findByIdAndUpdate(
      req.params.id,
      { $push: { internalNotes: { text, employeeId, timestamp: new Date() } } },
      { new: true }
    );
    if (!enquiry) return res.status(404).json({ message: "Enquiry not found" });
    res.json(enquiry);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const deleteEnquiry = async (req, res) => {
  try {
    const enquiry = await Enquiry.findByIdAndDelete(req.params.id);
    if (!enquiry) return res.status(404).json({ message: "Enquiry not found" });
    res.json({ message: "Enquiry deleted" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
