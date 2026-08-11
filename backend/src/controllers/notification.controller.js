import Notification from "../models/notification.model.js";

export const createNotification = async (req, res) => {
  try {
    const notification = await Notification.create({
      ...req.body,
      status: req.body.status || "queued",
    });
    res.status(201).json(notification);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

export const getNotifications = async (req, res) => {
  try {
    const filter = {};
    if (req.query.recipientId) filter.recipientId = req.query.recipientId;
    if (req.query.status) filter.status = req.query.status;
    if (req.query.recipientType) filter.recipientType = req.query.recipientType;

    res.json(await Notification.find(filter).sort({ sentAt: -1 }));
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const markAsSent = async (req, res) => {
  try {
    const notification = await Notification.findByIdAndUpdate(
      req.params.id,
      { status: "sent", sentAt: new Date() },
      { new: true }
    );
    if (!notification)
      return res.status(404).json({ message: "Notification not found" });
    res.json(notification);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const markAsFailed = async (req, res) => {
  try {
    const notification = await Notification.findByIdAndUpdate(
      req.params.id, { status: "failed" }, { new: true }
    );
    if (!notification)
      return res.status(404).json({ message: "Notification not found" });
    res.json(notification);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const deleteNotification = async (req, res) => {
  try {
    const notification = await Notification.findByIdAndDelete(req.params.id);
    if (!notification)
      return res.status(404).json({ message: "Notification not found" });
    res.json({ message: "Notification deleted" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
