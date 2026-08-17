import Enquiry from "../models/enquiry.model.js";
import Booking from "../models/booking.model.js";
import Estimate from "../models/estimate.model.js";
import Ticket from "../models/ticket.model.js";
import Customer from "../models/customer.model.js";

// Every email trigger needs to go find the Customer document (name/phone/
// email) for whatever it's sending about — estimates, work orders/tickets,
// and invoices each reach it via a different hop, so that lookup lives here
// once instead of being reimplemented per controller.

// An estimate is created from an enquiry (the common case) or, less often,
// directly against a booking.
export async function resolveCustomerFromEstimate(estimate) {
  let customerId = null;
  if (estimate.enquiryId) {
    const enquiry = await Enquiry.findById(estimate.enquiryId).select("customerId").lean();
    customerId = enquiry?.customerId;
  }
  if (!customerId && estimate.bookingId) {
    const booking = await Booking.findById(estimate.bookingId).select("customerId").lean();
    customerId = booking?.customerId;
  }
  return customerId ? Customer.findById(customerId).select("name phone email").lean() : null;
}

// Booking documents don't carry a customerId themselves (see booking.model.js
// — only customerName/phone are denormalized), so a Booking-Confirmed email
// resolves the customer the same way the source estimate did.
export async function resolveCustomerFromBooking(booking) {
  if (booking.customerId) {
    return Customer.findById(booking.customerId).select("name phone email").lean();
  }
  if (booking.estimateId) {
    const estimate = await Estimate.findById(booking.estimateId).select("enquiryId bookingId").lean();
    if (estimate) return resolveCustomerFromEstimate(estimate);
  }
  return null;
}

// Both the WorkOrder and Ticket models carry customerId directly — same
// shape, so one function covers whichever a given controller passes in.
export async function resolveCustomerFromWorkOrder(workOrder) {
  if (!workOrder?.customerId) return null;
  return Customer.findById(workOrder.customerId).select("name phone email").lean();
}

// Invoices reach the customer through their work order (Ticket).
export async function resolveCustomerFromInvoice(invoice) {
  if (!invoice.workOrderId) return null;
  const ticket = await Ticket.findById(invoice.workOrderId).select("customerId").lean();
  return ticket?.customerId ? Customer.findById(ticket.customerId).select("name phone email").lean() : null;
}

// The Customer collection (mongoose, keyed by phone OR email — see
// customer.model.js) and Better Auth's `user` collection are two entirely
// separate ID spaces — a Customer document's _id is never the same as the
// logged-in session's req.user.id. Every customer-facing "my bookings/
// estimates/invoices/payments" endpoint has to resolve the real Customer._id
// via the session first; using req.user.id directly as if it were a
// Customer._id silently matches nothing.
//
// Phone/password signups always have a phoneNumber; Google OAuth signups
// never do (see login/page.js) but always have a real email — matching the
// databaseHooks.user.create keyFilter logic in utils/auth.js that creates
// the Customer record in the first place. Checking only phone here meant
// every Google-signed-up customer's session resolved to no Customer at all,
// so their real bookings/enquiries existed in the database but could never
// be found — the dashboard just looked empty.
const SYNTHETIC_EMAIL_SUFFIX = "@phone.homecare247.internal";

export async function resolveCustomerIdForSession(req) {
  const phone = req.user?.phoneNumber;
  const email = req.user?.email && !req.user.email.endsWith(SYNTHETIC_EMAIL_SUFFIX)
    ? req.user.email
    : null;

  if (!phone && !email) return null;

  const query = phone && email ? { $or: [{ phone }, { email }] } : phone ? { phone } : { email };
  const customer = await Customer.findOne(query).select("_id").lean();
  return customer?._id || null;
}
