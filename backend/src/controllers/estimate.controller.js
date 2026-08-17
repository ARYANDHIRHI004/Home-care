import Estimate from "../models/estimate.model.js";
import Enquiry from "../models/enquiry.model.js";
import Booking from "../models/booking.model.js";
import { sendEmail } from "../utils/mailer.js";
import { buildEstimateEmailHtml } from "../emails/estimateEmail.js";
import { buildStatusUpdateEmailHtml } from "../emails/statusUpdateEmail.js";
import { resolveCustomerFromEstimate, resolveCustomerFromBooking, resolveCustomerIdForSession } from "../utils/resolveCustomer.js";
import { notifyCustomer } from "./notification.controller.js";
import { env } from "../utils/env.js";

const calculateTotal = (lineItems = [], visitCharges = 0, discount = 0) => {
  const subtotal = lineItems.reduce(
    (sum, item) => sum + Number(item.qty || 0) * Number(item.price || 0), 0
  );
  return subtotal + Number(visitCharges || 0) - Number(discount || 0);
};

// Fire-and-record, never fire-and-throw — a failed send must not undo the
// estimate that was just created, it just gets logged on the document so the
// office can tell a customer "yes it sent" or "no, here's why" instead of
// guessing when they say they never received it.
const trySendEstimateEmail = async (estimate) => {
  const customer = await resolveCustomerFromEstimate(estimate);
  if (!customer) return;

  await notifyCustomer({
    customerId: customer._id,
    type: "estimate_sent",
    message: `Your estimate ${estimate.estimateNumber || ""} for ₹${Number(estimate.total || 0).toLocaleString("en-IN")} is ready.`.trim(),
  });

  if (!customer.email) {
    // Phone-only signups are valid — no email on file just means this leg is
    // skipped, not an error. Dashboard link + WhatsApp copy-link cover it.
    return;
  }

  try {
    const dashboardUrl = `${env.CUSTOMER_APP_URL}/customer/estimates/${estimate._id}`;
    const html = buildEstimateEmailHtml({ estimate, customer, dashboardUrl });
    await sendEmail({
      to: customer.email,
      subject: `Your estimate ${estimate.estimateNumber || ""} from HomeCare247`.trim(),
      html,
    });
    estimate.emailSentAt = new Date();
    estimate.emailSendError = null;
  } catch (error) {
    estimate.emailSentAt = null;
    estimate.emailSendError = error.message || "Unknown error sending email";
  }
  await estimate.save();
};

// Booking Confirmed — one of the three short "status update" notifications.
const trySendBookingConfirmedEmail = async (booking) => {
  const customer = await resolveCustomerFromBooking(booking);
  if (!customer) return;

  await notifyCustomer({
    customerId: customer._id,
    type: "booking_confirmed",
    message: `Your booking for ${booking.serviceName} is confirmed.`,
  });

  if (!customer.email) return;

  try {
    const dashboardUrl = `${env.CUSTOMER_APP_URL}/customer/services/${booking._id}`;
    const html = buildStatusUpdateEmailHtml({
      customerName: customer.name || booking.customerName,
      headline: "Your booking is confirmed",
      detail: `${booking.serviceName} is booked${booking.scheduledDate ? ` for ${new Date(booking.scheduledDate).toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" })}` : ""}. We'll notify you once a professional is assigned.`,
      dashboardUrl,
      ctaLabel: "View Booking",
    });
    await sendEmail({
      to: customer.email,
      subject: `Booking confirmed — ${booking.serviceName}`,
      html,
    });
    booking.emailSentAt = new Date();
    booking.emailSendError = null;
  } catch (error) {
    booking.emailSentAt = null;
    booking.emailSendError = error.message || "Unknown error sending email";
  }
  await booking.save();
};

const nextNumber = async (Model, field, prefix) => {
  const last = await Model.findOne({ [field]: new RegExp(`^${prefix}-\\d+$`) })
    .sort({ [field]: -1 })
    .select(field)
    .lean();
  const seq = last ? Number(String(last[field]).split("-")[1]) + 1 : 1000;
  return `${prefix}-${seq}`;
};

export const createEstimate = async (req, res) => {
  try {
    const total = calculateTotal(
      req.body.lineItems,
      req.body.visitCharges,
      req.body.discount
    );

    let address = req.body.address;
    if (!address && req.body.enquiryId) {
      const enq = await Enquiry.findById(req.body.enquiryId);
      if (enq?.address) address = enq.address;
    }

    const estimate = await Estimate.create({
      ...req.body,
      address,
      estimateNumber: req.body.estimateNumber || (await nextNumber(Estimate, "estimateNumber", "EST")),
      total,
      approvalStatus: req.body.approvalStatus || "pending",
    });

    // Creating an estimate is what moves an enquiry past qualification. Without
    // this the enquiry sits at "qualified" forever and the same enquiry stays
    // selectable in the create-estimate picker after it has already been quoted.
    if (estimate.enquiryId) {
      await Enquiry.findByIdAndUpdate(estimate.enquiryId, { status: "converted" });
    }

    // Part of the same request that creates the estimate and marks it Sent —
    // never a second call the frontend has to remember to make, which is
    // exactly the window where an estimate could end up "Sent" with no email
    // actually delivered.
    if (estimate.status === "Sent") {
      await trySendEstimateEmail(estimate);
    }

    res.status(201).json(estimate);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Converts an Approved estimate into a confirmed Booking. Guarded so it can only
// run once and only from Approved — the UI hides the button otherwise, but the
// endpoint must not rely on the UI for that.
export const convertToBooking = async (req, res) => {
  try {
    const estimate = await Estimate.findById(req.params.id);
    if (!estimate) return res.status(404).json({ message: "Estimate not found" });

    if (estimate.status === "Converted" || estimate.bookingId) {
      return res.status(409).json({ message: "Estimate is already converted to a booking" });
    }
    if (estimate.status !== "Approved") {
      return res.status(422).json({ message: "Only an approved estimate can be converted" });
    }

    // Resolved once here (rather than left to the email helper's fallback)
    // so the Booking document itself carries its owner going forward, not
    // just at the moment this email happens to send.
    const customer = await resolveCustomerFromEstimate(estimate);

    const booking = await Booking.create({
      bookingNumber: await nextNumber(Booking, "bookingNumber", "BKG"),
      customerId: customer?._id,
      customerName: estimate.customerName || "Unknown",
      phone: estimate.phone,
      address: estimate.address,
      serviceName: estimate.serviceName || estimate.lineItems?.[0]?.name || "Service",
      serviceId: estimate.lineItems?.[0]?.serviceId || undefined,
      amount: estimate.total,
      estimateId: estimate._id,
      status: "pending_assignment",
      timelineStep: 3,
      createdBy: estimate.createdByName || "System",
    });

    estimate.status = "Converted";
    estimate.bookingId = booking._id;
    await estimate.save();

    await trySendBookingConfirmedEmail(booking);

    res.status(201).json({ estimate, booking });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

export const getEstimates = async (req, res) => {
  try {
    const filter = {};
    if (req.query.workOrderId) filter.workOrderId = req.query.workOrderId;
    if (req.query.enquiryId) filter.enquiryId = req.query.enquiryId;
    if (req.query.bookingId) filter.bookingId = req.query.bookingId;
    if (req.query.status) filter.status = req.query.status;
    if (req.query.approvalStatus) filter.approvalStatus = req.query.approvalStatus;

    res.json(
      await Estimate.find(filter)
        .populate("enquiryId", "serviceCategory description status")
        .populate("createdBy", "name email")
        .sort({ createdAt: -1 })
    );
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getMyEstimates = async (req, res) => {
  try {
    const customerId = await resolveCustomerIdForSession(req);
    if (!customerId) return res.json([]);

    const enquiries = await Enquiry.find({ customerId }).select("_id");
    const bookings = await Booking.find({ customerId }).select("_id");
    
    const enquiryIds = enquiries.map(e => e._id);
    const bookingIds = bookings.map(b => b._id);

    // If a customer has no enquiries and no bookings, they definitely have no estimates
    if (enquiryIds.length === 0 && bookingIds.length === 0) {
      return res.json([]);
    }

    const filter = {
      $or: [
        { enquiryId: { $in: enquiryIds } },
        { bookingId: { $in: bookingIds } }
      ]
    };

    res.json(
      await Estimate.find(filter)
        .populate("enquiryId", "serviceCategory description status")
        .populate("bookingId", "bookingNumber status")
        .sort({ createdAt: -1 })
    );
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Single-estimate counterpart to getMyEstimates, for the shareable dashboard
// link (/customer/estimates/:id) — the generic getEstimateById below is
// gated behind a staff-only permission, so a logged-in customer needs its
// own route that also proves the estimate actually belongs to them.
export const getMyEstimateById = async (req, res) => {
  try {
    const customerId = await resolveCustomerIdForSession(req);
    if (!customerId) return res.status(404).json({ message: "Estimate not found" });

    const estimate = await Estimate.findById(req.params.id)
      .populate("enquiryId", "serviceCategory description status customerId")
      .populate("bookingId", "bookingNumber status customerId");

    if (!estimate) return res.status(404).json({ message: "Estimate not found" });

    const ownerCustomerId = estimate.enquiryId?.customerId || estimate.bookingId?.customerId;
    if (!ownerCustomerId || String(ownerCustomerId) !== String(customerId)) {
      // 404, not 403 — don't confirm to a caller whether this ID exists at all.
      return res.status(404).json({ message: "Estimate not found" });
    }

    res.json(estimate);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Customer-facing Accept/Reject — deliberately not the same endpoint office
// staff use (updateApprovalStatus), which is gated behind a staff-only
// permission with no ownership check at all. This one is reachable by any
// authenticated customer but only ever touches the one estimate that's
// actually theirs, verified the same way getMyEstimateById does it.
export const respondToMyEstimate = async (req, res) => {
  try {
    const customerId = await resolveCustomerIdForSession(req);
    if (!customerId) return res.status(404).json({ message: "Estimate not found" });

    const { approvalStatus, acceptedTerms, rejectReason } = req.body;
    if (!["approved", "rejected"].includes(approvalStatus)) {
      return res.status(400).json({ message: "approvalStatus must be 'approved' or 'rejected'" });
    }

    const estimate = await Estimate.findById(req.params.id)
      .populate("enquiryId", "customerId")
      .populate("bookingId", "customerId");
    if (!estimate) return res.status(404).json({ message: "Estimate not found" });

    const ownerCustomerId = estimate.enquiryId?.customerId || estimate.bookingId?.customerId;
    if (!ownerCustomerId || String(ownerCustomerId) !== String(customerId)) {
      return res.status(404).json({ message: "Estimate not found" });
    }

    // Only a Sent/Viewed/Negotiation estimate is actually awaiting a
    // response — re-approving an already-Converted one, for instance,
    // would silently corrupt a booking that's already in motion.
    if (!["Sent", "Viewed", "Negotiation"].includes(estimate.status)) {
      return res.status(409).json({ message: "This estimate is no longer awaiting a response" });
    }

    estimate.approvalStatus = approvalStatus;
    estimate.status = approvalStatus === "approved" ? "Approved" : "Rejected";
    if (approvalStatus === "approved" && acceptedTerms) {
      estimate.acceptedTerms = { ...acceptedTerms, acceptedAt: new Date() };
    }
    if (approvalStatus === "rejected" && rejectReason) {
      estimate.rejectReason = rejectReason;
    }
    await estimate.save();

    res.json(estimate);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

export const getEstimateById = async (req, res) => {
  try {
    const estimate = await Estimate.findById(req.params.id)
      .populate("enquiryId", "serviceCategory description status")
      .populate("bookingId", "bookingNumber status")
      .populate("createdBy", "name email");

    if (!estimate) return res.status(404).json({ message: "Estimate not found" });
    res.json(estimate);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const updateEstimate = async (req, res) => {
  try {
    const data = { ...req.body };
    if (data.lineItems || data.visitCharges !== undefined || data.discount !== undefined) {
      data.total = calculateTotal(
        data.lineItems || [],
        data.visitCharges || 0,
        data.discount || 0
      );
    }

    const before = await Estimate.findById(req.params.id).select("status").lean();
    if (!before) return res.status(404).json({ message: "Estimate not found" });

    const estimate = await Estimate.findByIdAndUpdate(
      req.params.id, data, { new: true, runValidators: true }
    );

    // A Draft being sent later (the "Send to Customer" action on an existing
    // estimate) needs the same email as one sent at creation time — this is
    // the transition into Sent, not creation, so it only fires here once.
    if (data.status === "Sent" && before.status !== "Sent") {
      await trySendEstimateEmail(estimate);
    }

    res.json(estimate);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

export const updateApprovalStatus = async (req, res) => {
  try {
    const { approvalStatus, acceptedTerms, status } = req.body;
    const update = {};

    if (approvalStatus) {
      update.approvalStatus = approvalStatus;
      // Keep the customer-facing lifecycle status in step with the internal
      // sign-off, otherwise an approved estimate still reads as "Sent" in the
      // table and never offers Convert to Booking.
      if (approvalStatus === "approved") update.status = "Approved";
      if (approvalStatus === "rejected") update.status = "Rejected";
    }
    if (status) update.status = status;

    if (approvalStatus === "approved" && acceptedTerms) {
      update.acceptedTerms = { ...acceptedTerms, acceptedAt: new Date() };
    }

    const estimate = await Estimate.findByIdAndUpdate(
      req.params.id, update, { new: true }
    );

    if (!estimate) return res.status(404).json({ message: "Estimate not found" });
    res.json(estimate);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

export const deleteEstimate = async (req, res) => {
  try {
    const estimate = await Estimate.findByIdAndDelete(req.params.id);
    if (!estimate) return res.status(404).json({ message: "Estimate not found" });
    res.json({ message: "Estimate deleted" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
