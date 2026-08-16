import Customer from "../models/customer.model.js";
import { resolveCustomerIdForSession } from "../utils/resolveCustomer.js";

export const findOrCreateByPhone = async (req, res) => {
  try {
    const { name, phone, email, registrationChannel = "call" } = req.body;
    if (!phone) return res.status(400).json({ message: "Phone is required" });

    let customer = await Customer.findOne({ phone });

    if (customer) return res.status(200).json({ message: "Customer found", customer });

    customer = await Customer.create({
      name,
      phone,
      email,
      otpVerified: false,
      registrationChannel: "call",
    });

    return res.status(201).json({ message: "Customer created", customer });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

// Customer-scoped counterpart to getCustomers/createCustomer — checkout's
// saved-address picker and the registration flow both need to read/write
// the logged-in customer's own addresses[] without staff CUSTOMER_* permissions,
// the same way getMyBookings etc. resolve identity from the session instead
// of trusting a client-supplied id.
export const getMyAddresses = async (req, res) => {
  try {
    const customerId = await resolveCustomerIdForSession(req);
    if (!customerId) return res.json([]);
    const customer = await Customer.findById(customerId).select("addresses").lean();
    res.json(customer?.addresses || []);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const addMyAddress = async (req, res) => {
  try {
    const customerId = await resolveCustomerIdForSession(req);
    if (!customerId) return res.status(404).json({ message: "Customer profile not found for this account" });

    const { label, addressText, lat, lng, placeId } = req.body;
    if (!addressText?.trim()) {
      return res.status(400).json({ message: "addressText is required" });
    }

    const address = {
      label: label?.trim() || "Home",
      addressText: addressText.trim(),
      ...(typeof lat === "number" && typeof lng === "number"
        ? { lat, lng, location: { type: "Point", coordinates: [lng, lat] } }
        : {}),
      ...(placeId ? { placeId } : {}),
    };

    const customer = await Customer.findByIdAndUpdate(
      customerId,
      { $push: { addresses: address } },
      { new: true, runValidators: true }
    ).select("addresses");

    if (!customer) return res.status(404).json({ message: "Customer not found" });
    res.status(201).json(customer.addresses);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

export const deleteMyAddress = async (req, res) => {
  try {
    const customerId = await resolveCustomerIdForSession(req);
    if (!customerId) return res.status(404).json({ message: "Customer profile not found for this account" });

    const customer = await Customer.findByIdAndUpdate(
      customerId,
      { $pull: { addresses: { _id: req.params.addressId } } },
      { new: true }
    ).select("addresses");

    if (!customer) return res.status(404).json({ message: "Customer not found" });
    res.json(customer.addresses);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

export const createCustomer = async (req, res) => {
  try {
    const customer = await Customer.create(req.body);
    res.status(201).json(customer);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

export const getCustomers = async (req, res) => {
  try {
    const { phone, name, otpVerified } = req.query;
    const filter = {};
    if (phone) filter.phone = phone;
    if (name) filter.name = { $regex: name, $options: "i" };
    if (otpVerified !== undefined) filter.otpVerified = otpVerified === "true";

    res.json(await Customer.find(filter).sort({ createdAt: -1 }));
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getCustomerById = async (req, res) => {
  try {
    const customer = await Customer.findById(req.params.id);
    if (!customer) return res.status(404).json({ message: "Customer not found" });
    res.json(customer);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const updateCustomer = async (req, res) => {
  try {
    const customer = await Customer.findByIdAndUpdate(
      req.params.id, req.body, { new: true, runValidators: true }
    );
    if (!customer) return res.status(404).json({ message: "Customer not found" });
    res.json(customer);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

export const verifyCustomerOtp = async (req, res) => {
  try {
    const customer = await Customer.findByIdAndUpdate(
      req.params.id, { otpVerified: true }, { new: true }
    );
    if (!customer) return res.status(404).json({ message: "Customer not found" });
    res.json(customer);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const deleteCustomer = async (req, res) => {
  try {
    const customer = await Customer.findByIdAndDelete(req.params.id);
    if (!customer) return res.status(404).json({ message: "Customer not found" });
    res.json({ message: "Customer deleted" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
