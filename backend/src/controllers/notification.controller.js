import Notification from "../models/notification.model.js";
import { resolveCustomerIdForSession } from "../utils/resolveCustomer.js";

// Shared by every email trigger point (partner assigned, estimate sent,
// booking confirmed, payment verified) — writes the in-app bell entry in the
// same call that sends the email, so the two channels can't drift apart.
// Fire-and-log, same discipline as the email helpers: a notification-write
// failure must never undo whatever real action (assignment, conversion,
// verification) just happened.
export async function notifyCustomer({ customerId, type, message }) {
  if (!customerId) return;
  try {
    await Notification.create({
      recipientId: customerId,
      recipientType: "customer",
      channel: "in_app",
      type,
      message,
      status: "sent",
      sentAt: new Date(),
    });
  } catch (error) {
    console.error(`Notification write failed for customer ${customerId}:`, error.message);
  }
}

// Customer-scoped counterpart to getNotifications — the bell in CustomerNav
// needs its own recipientId, session-derived like every other "my X" route,
// never staff-permission-gated (there is no customer role in ROLE_PERMISSIONS
// for NOTIFICATION_MANAGE, and there shouldn't be — a customer only ever
// needs to see their own).
export const getMyNotifications = async (req, res) => {
  try {
    const customerId = await resolveCustomerIdForSession(req);
    if (!customerId) return res.json([]);
    const notifications = await Notification.find({
      recipientId: customerId,
      recipientType: "customer",
    }).sort({ createdAt: -1 });
    res.json(notifications);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const markMyNotificationRead = async (req, res) => {
  try {
    const customerId = await resolveCustomerIdForSession(req);
    if (!customerId) return res.status(404).json({ message: "Notification not found" });

    const notification = await Notification.findOneAndUpdate(
      { _id: req.params.id, recipientId: customerId, recipientType: "customer" },
      { read: true },
      { new: true }
    );
    if (!notification) return res.status(404).json({ message: "Notification not found" });
    res.json(notification);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const markAllMyNotificationsRead = async (req, res) => {
  try {
    const customerId = await resolveCustomerIdForSession(req);
    if (!customerId) return res.json({ modifiedCount: 0 });
    const result = await Notification.updateMany(
      { recipientId: customerId, recipientType: "customer", read: false },
      { read: true }
    );
    res.json({ modifiedCount: result.modifiedCount });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

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
