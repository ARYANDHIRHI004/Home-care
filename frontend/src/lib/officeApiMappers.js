// Office ERP mappers — the mirror of customerApiMappers.js for the admin side.
// Backend documents are normalized (numeric totals, ISO dates, Mongo _id); the
// office tables were built against display-formatted strings. Mapping here keeps
// that formatting in one place instead of scattering toLocaleString across JSX.

const inr = (n) => `₹${Number(n || 0).toLocaleString('en-IN')}`;

const shortDate = (d) =>
  d
    ? new Date(d).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
    : '-';

// Renders the validity column: an expiry in the past reads "Expired", one within
// the next week counts down, anything further out is just "Valid".
function validityLabel(validUntil, status) {
  if (status === 'Pending Approval') return 'Requires Approval';
  if (!validUntil) return 'Valid';

  const days = Math.ceil((new Date(validUntil) - Date.now()) / 86_400_000);
  if (days < 0) return 'Expired';
  if (days === 0) return 'Today';
  if (days <= 7) return `${days} Day${days === 1 ? '' : 's'} Left`;
  return 'Valid';
}

export function mapOfficeEstimate(estimate) {
  const subtotal = (estimate.lineItems || []).reduce(
    (sum, i) => sum + Number(i.qty || 0) * Number(i.price || 0),
    0
  );
  const customer = estimate.customerName || 'Unknown';
  const status = estimate.status || 'Draft';

  return {
    id: estimate._id,
    displayId: estimate.estimateNumber || `EST-${String(estimate._id).slice(-6).toUpperCase()}`,
    customer,
    phone: estimate.phone || '-',
    service:
      estimate.serviceName ||
      (estimate.lineItems || []).map((i) => i.name).filter(Boolean).join(', ') ||
      'Service',
    amount: inr(subtotal + Number(estimate.visitCharges || 0)),
    discount: inr(estimate.discount),
    finalAmount: inr(estimate.total),
    validity: validityLabel(estimate.validUntil, status),
    createdBy: estimate.createdBy?.name || estimate.createdByName || 'System',
    status,
    approvalStatus: estimate.approvalStatus,
    date: shortDate(estimate.createdAt),
    initial: customer.charAt(0).toUpperCase() || '?',
    lineItems: estimate.lineItems || [],
    visitCharges: Number(estimate.visitCharges || 0),
    enquiryId: estimate.enquiryId?._id || estimate.enquiryId || null,
    bookingId: estimate.bookingId?._id || estimate.bookingId || null,
    _raw: estimate,
  };
}

export function mapOfficeWorkOrder(wo) {
  return {
    id: wo._id,
    displayId: wo.workOrderNumber || `WO-${String(wo._id).slice(-6).toUpperCase()}`,
    label: wo.title || wo.serviceName || 'Service visit',
    status: wo.status || 'Pending',
    assignedTo: wo.partnerId?.name || wo.assignedTo || 'Unassigned',
    date: wo.scheduledDate
      ? `${shortDate(wo.scheduledDate)}${wo.scheduledTime ? `, ${wo.scheduledTime}` : ''}`
      : 'Not scheduled',
    bookingId: wo.bookingId?._id || wo.bookingId || null,
    _raw: wo,
  };
}

export { inr, shortDate };
