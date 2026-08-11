import Ticket from "../models/ticket.model.js";
import Enquiry from "../models/enquiry.model.js";

const generateTicketNumber = () => {
  const year = new Date().getFullYear();
  const random = Math.floor(1000 + Math.random() * 9000);
  return `TCK-${year}-${random}`;
};

export const createTicket = async (req, res) => {
  try {
    const { enquiryId, customerId, byEmployeeId } = req.body;

    if (!enquiryId || !customerId)
      return res.status(400).json({ message: "enquiryId and customerId are required" });

    const ticket = await Ticket.create({
      ...req.body,
      ticketNumber: req.body.ticketNumber || generateTicketNumber(),
      status: "open",
      timeline: [{ status: "open", timestamp: new Date(), byEmployeeId }],
    });

    await Enquiry.findByIdAndUpdate(enquiryId, { status: "converted" });
    res.status(201).json(ticket);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

export const getTickets = async (req, res) => {
  try {
    const filter = {};
    if (req.query.status) filter.status = req.query.status;
    if (req.query.priority) filter.priority = req.query.priority;
    if (req.query.assignedPartnerId) filter.assignedPartnerId = req.query.assignedPartnerId;
    if (req.query.customerId) filter.customerId = req.query.customerId;

    const tickets = await Ticket.find(filter)
      .populate("customerId", "name phone email")
      .populate("assignedPartnerId", "name phone skills")
      .sort({ createdAt: -1 });

    res.json(tickets);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getTicketById = async (req, res) => {
  try {
    const ticket = await Ticket.findById(req.params.id)
      .populate("customerId")
      .populate("enquiryId")
      .populate("assignedPartnerId");

    if (!ticket) return res.status(404).json({ message: "Ticket not found" });
    res.json(ticket);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const updateTicketStatus = async (req, res) => {
  try {
    const { status, byEmployeeId } = req.body;
    if (!status) return res.status(400).json({ message: "status is required" });

    const ticket = await Ticket.findByIdAndUpdate(
      req.params.id,
      {
        status,
        $push: { timeline: { status, timestamp: new Date(), byEmployeeId } },
      },
      { new: true }
    );

    if (!ticket) return res.status(404).json({ message: "Ticket not found" });
    res.json(ticket);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

export const assignPartner = async (req, res) => {
  try {
    const { assignedPartnerId, byEmployeeId } = req.body;

    const ticket = await Ticket.findByIdAndUpdate(
      req.params.id,
      {
        assignedPartnerId,
        status: "assigned",
        $push: {
          timeline: { status: "assigned", timestamp: new Date(), byEmployeeId },
        },
      },
      { new: true }
    );

    if (!ticket) return res.status(404).json({ message: "Ticket not found" });
    res.json(ticket);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

export const addTicketNote = async (req, res) => {
  try {
    const { text, employeeId } = req.body;
    const ticket = await Ticket.findByIdAndUpdate(
      req.params.id,
      { $push: { internalNotes: { text, employeeId, timestamp: new Date() } } },
      { new: true }
    );

    if (!ticket) return res.status(404).json({ message: "Ticket not found" });
    res.json(ticket);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const deleteTicket = async (req, res) => {
  try {
    const ticket = await Ticket.findByIdAndDelete(req.params.id);
    if (!ticket) return res.status(404).json({ message: "Ticket not found" });
    res.json({ message: "Ticket deleted" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
