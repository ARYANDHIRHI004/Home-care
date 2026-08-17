export const TIMELINE_STEPS = [
  'Enquiry Submitted',
  'Estimate Sent',
  'Estimate Approved',
  'Booking Confirmed',
  'Partner Assigned',
  'Technician On Route',
  'Work Started',
  'Completed',
];

// A submitted request has nowhere to render until office converts it into a
// Booking (Enquiry -> Estimate -> Booking) — this is what fills that gap on
// the customer Dashboard: "Enquiry Submitted", step 0 of the same timeline
// mapCustomerBooking's `timelineStep` already indexes into.
export function mapCustomerEnquiry(enquiry) {
  return {
    id: enquiry._id,
    displayId: `REQ-${enquiry._id?.slice(-6).toUpperCase()}`,
    service: enquiry.serviceCategory || 'Service',
    icon: serviceIcon(enquiry.serviceCategory),
    status: 'active',
    // Distinguishes "not a real Booking yet" — /customer/services/[bookingId]
    // has nothing to show for a plain enquiry id, so callers use this to
    // skip linking there until office actually converts it.
    isPendingRequest: true,
    timelineStep: 0,
    date: enquiry.createdAt ? new Date(enquiry.createdAt).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' }) : '-',
    time: '-',
    amount: 0,
    address: enquiry.address || '-',
    partner: null,
    estimate: null,
    invoice: null,
    _raw: enquiry,
  };
}

export function mapCustomerBooking(booking) {
  const service = booking.serviceId?.name || booking.serviceName || 'Service';
  return {
    id: booking._id,
    displayId: booking.bookingNumber,
    service,
    category: booking.category || 'General',
    icon: serviceIcon(booking.category),
    status: normalizeBookingStatus(booking.status),
    timelineStep: booking.timelineStep || 0,
    date: booking.scheduledDate ? new Date(booking.scheduledDate).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' }) : '-',
    time: booking.scheduledTime || '-',
    amount: Number(booking.amount || 0),
    address: booking.address || '-',
    partner: booking.partnerId ? { name: booking.partnerId.name, rating: booking.partnerId.rating, experience: booking.partnerId.experience } : null,
    estimate: booking.estimateId ? mapCustomerEstimate(booking.estimateId, booking) : null,
    invoice: booking.invoiceId ? mapCustomerInvoice(booking.invoiceId, booking) : null,
    cancelReason: booking.cancelReason,
    _raw: booking,
  };
}

export function mapCustomerEstimate(estimate, booking) {
  const service = booking?.serviceId?.name || booking?.serviceName || estimate.lineItems?.[0]?.name || 'Service';
  return {
    id: estimate._id,
    displayId: estimate.estimateNumber || `EST-${estimate._id?.slice(-6).toUpperCase()}`,
    bookingId: booking?._id || estimate.bookingId?._id || estimate.bookingId || estimate.workOrderId?._id || estimate.workOrderId,
    service,
    status: estimate.approvalStatus?.replace(/^\w/, (m) => m.toUpperCase()) || 'Pending',
    amount: Number(estimate.total || 0),
    expiresIn: estimate.expiresIn || null,
    visitCharge: Number(estimate.visitCharges || 0),
    discount: Number(estimate.discount || 0),
    lineItems: estimate.lineItems || [],
    booking: booking ? mapCustomerBookingShell(booking) : null,
    _raw: estimate,
  };
}

export function mapCustomerInvoice(invoice, booking) {
  return {
    id: invoice._id,
    displayId: invoice.invoiceNumber || `INV-${invoice._id?.slice(-6).toUpperCase()}`,
    bookingId: booking?._id || invoice.bookingId?._id || invoice.bookingId || invoice.workOrderId?._id || invoice.workOrderId,
    service: booking?.serviceId?.name || booking?.serviceName || invoice.lineItems?.[0]?.name || 'Service',
    amount: Number(invoice.total || 0),
    status: invoice.paymentStatus === 'paid' ? 'Paid' : invoice.paymentStatus === 'partial' ? 'Payment Under Verification' : 'Unpaid',
    date: invoice.createdAt ? new Date(invoice.createdAt).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' }) : '-',
    _raw: invoice,
  };
}

export function mapCustomerPayment(payment) {
  return {
    id: payment._id,
    invoiceId: payment.invoiceId?.invoiceNumber || payment.invoiceId?._id || payment.invoiceId,
    amount: Number(payment.amount || 0),
    method: payment.method?.toUpperCase() || '-',
    date: payment.createdAt ? new Date(payment.createdAt).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' }) : '-',
    status: payment.status === 'verified' ? 'Verified' : payment.status === 'failed' ? 'Failed' : 'Payment Under Verification',
  };
}

function mapCustomerBookingShell(booking) {
  return {
    id: booking._id,
    service: booking.serviceId?.name || booking.serviceName || 'Service',
    address: booking.address || '-',
  };
}

function normalizeBookingStatus(status) {
  if (status === 'in_progress') return 'active';
  if (status === 'confirmed' || status === 'pending_assignment') return 'upcoming';
  return status || 'upcoming';
}

function serviceIcon(category) {
  if (/clean/i.test(category || '')) return '🧹';
  if (/ac|appliance/i.test(category || '')) return '❄️';
  if (/plumb/i.test(category || '')) return '🔧';
  return '🛠️';
}
