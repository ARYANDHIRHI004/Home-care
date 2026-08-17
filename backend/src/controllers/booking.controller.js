import Booking from "../models/booking.model.js";
import { resolveCustomerIdForSession } from "../utils/resolveCustomer.js";

const populateBooking = (query) =>
  query
    .populate("customerId", "name phone email addresses")
    .populate("serviceId", "name basePrice")
    .populate("partnerId", "name phone rating")
    .populate("estimateId")
    .populate("invoiceId");

export const createBooking = async (req, res) => {
  try {
    const booking = await Booking.create(req.body);
    res.status(201).json(await populateBooking(Booking.findById(booking._id)));
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

export const getBookings = async (req, res) => {
  try {
    const filter = {};
    if (req.query.status) filter.status = req.query.status;
    if (req.query.customerId) filter.customerId = req.query.customerId;
    if (req.query.partnerId) filter.partnerId = req.query.partnerId;

    res.json(await populateBooking(Booking.find(filter).sort({ scheduledDate: 1, createdAt: -1 })));
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getMyBookings = async (req, res) => {
  try {
    const customerId = await resolveCustomerIdForSession(req);
    if (!customerId) return res.json([]);
    res.json(await populateBooking(Booking.find({ customerId }).sort({ scheduledDate: 1, createdAt: -1 })));
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getMyBookingById = async (req, res) => {
  try {
    const customerId = await resolveCustomerIdForSession(req);
    if (!customerId) return res.status(401).json({ message: "Unauthorized" });
    const booking = await populateBooking(Booking.findOne({ _id: req.params.id, customerId }));
    if (!booking) return res.status(404).json({ message: "Booking not found" });
    res.json(booking);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getBookingById = async (req, res) => {
  try {
    const booking = await populateBooking(Booking.findById(req.params.id));
    if (!booking) return res.status(404).json({ message: "Booking not found" });
    res.json(booking);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const updateBooking = async (req, res) => {
  try {
    const booking = await populateBooking(
      Booking.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true })
    );
    if (!booking) return res.status(404).json({ message: "Booking not found" });
    res.json(booking);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

export const updateBookingStatus = async (req, res) => {
  try {
    const booking = await populateBooking(
      Booking.findByIdAndUpdate(
        req.params.id,
        { status: req.body.status, ...(req.body.cancelReason ? { cancelReason: req.body.cancelReason } : {}) },
        { new: true, runValidators: true }
      )
    );
    if (!booking) return res.status(404).json({ message: "Booking not found" });
    res.json(booking);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

export const deleteBooking = async (req, res) => {
  try {
    const booking = await Booking.findByIdAndDelete(req.params.id);
    if (!booking) return res.status(404).json({ message: "Booking not found" });
    res.json({ message: "Booking deleted" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
