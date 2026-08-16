// Single source of truth for every status/enum value used by a frontend
// <select> or filter across the office ERP. Hand-declared rather than read
// off `Model.schema.path(x).enumValues` at request time — that approach was
// tried in config.controller.js and silently 500'd the whole endpoint the
// moment one field name didn't match (Invoice's status field is actually
// `paymentStatus`; Customer has no `status` field at all). A wrong or
// renamed field here just means a stale array, not a crash.
//
// Every value below was verified against its model file directly. Where a
// model field only has two states expressed as a boolean (e.g. ServicePartner
// and Service both use `active`), there is deliberately no fake multi-value
// enum invented for it here — see PARTNER_ACTIVE/SERVICE_ACTIVE_NOTE below.

export const ENQUIRY_SOURCE = ["website", "call", "whatsapp", "facebook", "instagram", "customer_portal"];
export const ENQUIRY_STATUS = ["new", "contacted", "qualified", "converted", "dropped"];
export const TIME_SLOTS = ["9 - 11", "11 - 1", "2 - 4", "4 - 6"];

// Estimate has two independent status-like fields — `status` is the
// customer-facing lifecycle (what Estimates page filters/drawer key off),
// `approvalStatus` is the internal manager sign-off. Both real, both distinct.
export const ESTIMATE_STATUS = [
  "Draft", "Pending Approval", "Sent", "Viewed", "Negotiation",
  "Approved", "Rejected", "Expired", "Converted", "Cancelled",
];
export const ESTIMATE_APPROVAL_STATUS = ["pending", "approved", "rejected"];

export const BOOKING_STATUS = ["active", "upcoming", "completed", "cancelled", "pending_assignment", "confirmed", "in_progress"];
export const BOOKING_PAYMENT_STATUS = ["pending", "partial", "paid", "under_verification"];

// Verified against work-order.model.js directly. Declined/Invoiced/Paid do
// NOT exist in this schema — a Kanban board fix elsewhere in the frontend
// invented columns for them, which is why those columns render permanently
// empty. That's a schema gap, not something this constants file can paper
// over by inventing values the database will reject.
export const WORK_ORDER_STATUS = ["open", "estimate_sent", "approved", "assigned", "in_progress", "completed", "closed"];
export const WORK_ORDER_PRIORITY = ["low", "normal", "high"];

// Ticket is the backing collection for office/complaints. Its schema is
// byte-identical to WorkOrder's (same status/priority values) — apparently
// copied from it — which reads oddly for a complaint's real-world lifecycle,
// but this file mirrors the schema as written, not what a complaint
// "should" look like.
export const COMPLAINT_STATUS = ["open", "estimate_sent", "approved", "assigned", "in_progress", "completed", "closed"];
export const COMPLAINT_PRIORITY = ["low", "normal", "high"];

// Invoice's real field is `paymentStatus`, not `status`.
export const INVOICE_STATUS = ["unpaid", "partial", "paid"];

export const PAYMENT_METHOD = ["cash", "upi", "razorpay"];
export const PAYMENT_TRANSACTION_STATUS = ["pending", "verified", "failed"];

export const EMPLOYEE_ROLE = ["super_admin", "ops_executive", "support_billing", "marketing", "investor"];

export const COUPON_TYPE = ["percentage", "flat", "free_visit"];
export const COUPON_STATUS = ["active", "scheduled", "paused", "expired", "archived"];

export const EXPENSE_PAYMENT_METHOD = ["Corporate Card", "UPI", "Bank Transfer", "Petty Cash", "Cash", "Other"];

export const NOTIFICATION_RECIPIENT_TYPE = ["customer", "partner", "employee"];
export const NOTIFICATION_CHANNEL = ["sms", "whatsapp", "email", "push"];
export const NOTIFICATION_STATUS = ["queued", "sent", "failed"];
