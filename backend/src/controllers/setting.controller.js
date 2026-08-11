import Setting from "../models/setting.model.js";

export const getSettings = async (req, res) => {
  try {
    const settings = await Setting.findOne();
    if (!settings) return res.status(404).json({ message: "Settings not found" });
    res.json(settings);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const createOrUpdateSettings = async (req, res) => {
  try {
    const settings = await Setting.findOneAndUpdate(
      {},
      { ...req.body, updatedAt: new Date() },
      { new: true, upsert: true, runValidators: true }
    );
    res.json(settings);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

export const updateInvoiceSettings = async (req, res) => {
  try {
    res.json(await Setting.findOneAndUpdate(
      {},
      { invoiceSettings: req.body, updatedAt: new Date() },
      { new: true, upsert: true }
    ));
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

export const updateWhatsAppSettings = async (req, res) => {
  try {
    res.json(await Setting.findOneAndUpdate(
      {},
      { whatsappSettings: req.body, updatedAt: new Date() },
      { new: true, upsert: true }
    ));
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

export const updatePaymentSettings = async (req, res) => {
  try {
    res.json(await Setting.findOneAndUpdate(
      {},
      { paymentSettings: req.body, updatedAt: new Date() },
      { new: true, upsert: true }
    ));
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};
