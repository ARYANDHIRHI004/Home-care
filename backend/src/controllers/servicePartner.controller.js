import ServicePartner from "../models/servicePartner.model.js";

export const createPartner = async (req, res) => {
  try {
    res.status(201).json(await ServicePartner.create(req.body));
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

export const getPartners = async (req, res) => {
  try {
    const filter = {};
    if (req.query.active !== undefined) filter.active = req.query.active === "true";
    if (req.query.skill) filter.skills = req.query.skill;
    if (req.query.phone) filter.phone = req.query.phone;

    res.json(await ServicePartner.find(filter).sort({ name: 1 }));
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getPartnerById = async (req, res) => {
  try {
    const partner = await ServicePartner.findById(req.params.id);
    if (!partner) return res.status(404).json({ message: "Partner not found" });
    res.json(partner);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const updatePartner = async (req, res) => {
  try {
    const partner = await ServicePartner.findByIdAndUpdate(
      req.params.id, req.body, { new: true, runValidators: true }
    );
    if (!partner) return res.status(404).json({ message: "Partner not found" });
    res.json(partner);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

export const togglePartner = async (req, res) => {
  try {
    const partner = await ServicePartner.findById(req.params.id);
    if (!partner) return res.status(404).json({ message: "Partner not found" });
    partner.active = !partner.active;
    await partner.save();
    res.json(partner);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const deletePartner = async (req, res) => {
  try {
    const partner = await ServicePartner.findByIdAndDelete(req.params.id);
    if (!partner) return res.status(404).json({ message: "Partner not found" });
    res.json({ message: "Partner deleted" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
