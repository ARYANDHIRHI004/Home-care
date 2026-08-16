import ServiceArea from "../models/serviceArea.model.js";
import ServiceAreaLead from "../models/serviceAreaLead.model.js";
import { checkServiceability } from "../utils/service-area-matcher.js";

export const createServiceArea = async (req, res) => {
  try {
    res.status(201).json(await ServiceArea.create(req.body));
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

export const getServiceAreas = async (req, res) => {
  try {
    const filter = {};
    if (req.query.active !== undefined) filter.active = req.query.active === "true";
    if (req.query.city) filter.city = req.query.city;
    res.json(await ServiceArea.find(filter).sort({ name: 1 }));
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getServiceAreaById = async (req, res) => {
  try {
    const area = await ServiceArea.findById(req.params.id);
    if (!area) return res.status(404).json({ message: "Service area not found" });
    res.json(area);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const updateServiceArea = async (req, res) => {
  try {
    const area = await ServiceArea.findByIdAndUpdate(
      req.params.id, req.body, { new: true, runValidators: true }
    );
    if (!area) return res.status(404).json({ message: "Service area not found" });
    res.json(area);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

export const deleteServiceArea = async (req, res) => {
  try {
    const area = await ServiceArea.findByIdAndDelete(req.params.id);
    if (!area) return res.status(404).json({ message: "Service area not found" });
    res.json({ message: "Service area deleted" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// POST /api/service-areas/check — { locality } or { lat, lng } -> { serviceable, matchedArea }
// Public: called from customer checkout before the customer necessarily has
// an account, so it can't sit behind requireAuth like the rest of this file.
export const checkServiceArea = async (req, res) => {
  try {
    const { locality, lat, lng } = req.body;
    if (!locality && (typeof lat !== "number" || typeof lng !== "number")) {
      return res.status(400).json({ message: "Provide locality or { lat, lng }" });
    }
    const result = await checkServiceability({ locality, lat, lng });
    res.json(result);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// POST /api/service-areas/notify-me — { contact, locality? } from the
// "unavailable" page. Public, same reasoning as /check.
export const notifyMeWhenAvailable = async (req, res) => {
  try {
    const { contact, locality } = req.body;
    if (!contact?.trim()) {
      return res.status(400).json({ message: "contact is required" });
    }
    await ServiceAreaLead.create({ contact: contact.trim(), locality: locality?.trim() });
    res.status(201).json({ success: true });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};
