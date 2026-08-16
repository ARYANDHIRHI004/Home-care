import Enquiry from "../models/enquiry.model.js";
import Customer from "../models/customer.model.js";
import { checkServiceability } from "../utils/service-area-matcher.js";
import { sendEmail } from "../utils/mailer.js";
import { buildStatusUpdateEmailHtml } from "../emails/statusUpdateEmail.js";
import { resolveCustomerIdForSession } from "../utils/resolveCustomer.js";
import { env } from "../utils/env.js";

// Must match utils/auth.js's SYNTHETIC_EMAIL_SUFFIX / frontend's
// syntheticEmailForPhone() — phone signups get a non-deliverable placeholder
// email under the hood. Never persist that onto a Customer record as if it
// were real, or every email-sending feature (estimates, invoices, status
// updates) will think this customer has an email and keep trying — and
// failing — to send to a fake address instead of skipping gracefully.
const SYNTHETIC_EMAIL_SUFFIX = "@phone.homecare247.internal";
const realEmailOrUndefined = (email) => (email && !email.endsWith(SYNTHETIC_EMAIL_SUFFIX) ? email : undefined);

// Fire-and-record, same pattern as every other email trigger in this app —
// a failed send must not undo the enquiry that was just created. Customer
// portal submissions only: office-logged enquiries (call-in, WhatsApp, etc.)
// have their own follow-up process and aren't waiting on an auto-email.
const trySendEnquirySubmittedEmail = async (enquiry, customer) => {
  if (!customer?.email) return; // phone-only signups are valid, just skip this leg

  try {
    const dashboardUrl = `${env.CUSTOMER_APP_URL}/customer/dashboard`;
    const html = buildStatusUpdateEmailHtml({
      customerName: customer.name,
      headline: "We've received your request",
      detail: `Thanks for booking ${enquiry.serviceCategory} with us. Our team will call you within 2 hours to confirm the details and share an estimate.`,
      dashboardUrl,
      ctaLabel: "Track Your Request",
    });
    await sendEmail({
      to: customer.email,
      subject: `Request received — ${enquiry.serviceCategory}`,
      html,
    });
    enquiry.emailSentAt = new Date();
    enquiry.emailSendError = null;
  } catch (error) {
    enquiry.emailSentAt = null;
    enquiry.emailSendError = error.message || "Unknown error sending email";
  }
  await enquiry.save();
};

export const createEnquiry = async (req, res) => {
  try {
    const { name, phone, email, source, serviceCategory, description, locality, address, ...rest } = req.body;

    // A disabled frontend "Next" button is not enough — this is the real
    // gate. Only customer_portal submissions are restricted; office staff
    // logging a call-in enquiry from any area must go through untouched.
    if (source === "customer_portal") {
      const { serviceable } = await checkServiceability({ locality });
      if (!serviceable) {
        return res.status(422).json({
          message: "This area is not currently serviceable",
          serviceable: false,
        });
      }
    }

    let customer;
    if (source === "customer_portal") {
      // The booking form never collects name/phone/email — the customer is
      // already authenticated, so their identity comes from the session
      // (requireAuth already populated req.user), not from unauthenticated
      // request-body fields. Trusting req.body here would let anyone attach
      // an enquiry to any phone number they typed in.
      const sessionPhone = req.user?.phoneNumber;
      customer = sessionPhone ? await Customer.findOne({ phone: sessionPhone }) : null;
      if (!customer && sessionPhone) {
        customer = await Customer.create({
          name: req.user.name || "Customer",
          phone: sessionPhone,
          email: realEmailOrUndefined(req.user.email),
          otpVerified: true,
          registrationChannel: "website",
        });
      }
    } else {
      customer = phone ? await Customer.findOne({ phone }) : null;
      if (!customer && phone) {
        customer = await Customer.create({
          name,
          phone,
          email,
          otpVerified: false,
          registrationChannel: "call",
        });
      }
    }

    const enquiry = await Enquiry.create({
      ...rest,
      customerId: customer?._id,
      source,
      serviceCategory,
      description,
      locality,
      address,
    });

    // Part of the same request that creates the enquiry — a customer_portal
    // submission gets an immediate "we've got it" email, not a separate
    // follow-up call the frontend would have to remember to make.
    if (source === "customer_portal") {
      await trySendEnquirySubmittedEmail(enquiry, customer);
    }

    res.status(201).json(enquiry);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Customer-scoped counterpart to getEnquiries — lets the Dashboard show a
// submitted request immediately, before it's ever converted to a Booking
// (which only happens once office creates and the customer approves an
// Estimate). Without this, a just-submitted request has nowhere to render:
// getMyBookings only returns actual Bookings, and there was never a
// customer-facing way to see "request received, awaiting review."
export const getMyEnquiries = async (req, res) => {
  try {
    const customerId = await resolveCustomerIdForSession(req);
    if (!customerId) return res.json([]);

    res.json(await Enquiry.find({ customerId }).sort({ createdAt: -1 }));
  } catch (error) {
    res.status(500).json({ message: error.message });
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
