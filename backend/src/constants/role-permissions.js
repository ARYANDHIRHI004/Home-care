import { ROLES } from "../enum/role.enum.js";
import { PERMISSIONS as P } from "./permissions.js";

const allCrud = (resource) => [
  `${resource}:create`,
  `${resource}:read`,
  `${resource}:update`,
  `${resource}:delete`,
];

const allPermissions = [
  ...Object.values(P),
  ...allCrud("customer"),
  ...allCrud("enquiry"),
  ...allCrud("booking"),
  ...allCrud("work_order"),
  ...allCrud("estimate"),
  ...allCrud("invoice"),
  ...allCrud("payment"),
  ...allCrud("category"),
  ...allCrud("service"),
  ...allCrud("coupon"),
  ...allCrud("service-partner"),
  ...allCrud("partner"),
  ...allCrud("employee"),
  ...allCrud("conversation"),
  ...allCrud("feedback"),
  ...allCrud("notification"),
  ...allCrud("setting"),
  ...allCrud("terms-and-condition"),
  ...allCrud("terms"),
  ...allCrud("ticket"),
];

export const ROLE_PERMISSIONS = Object.freeze({
  admin: allPermissions,
  [ROLES.SUPER_ADMIN]: allPermissions,

  // Self-service customers (Better Auth defaults new signups to this role).
  // They only ever hit permission-gated routes for the one self-service
  // write this app has — submitting a booking as an enquiry from the
  // checkout flow. Everything else customer-facing (their own bookings,
  // estimates, invoices, payments, profile) goes through separate `/me`
  // routes that intentionally have no requirePermission gate at all, so
  // this role does not need read/update/delete on any of these resources.
  customer: [P.ENQUIRY_CREATE],

  [ROLES.OPS_EXECUTIVE]: [
    ...allCrud("customer"),
    ...allCrud("enquiry"),
    ...allCrud("booking"),
    ...allCrud("work_order"),
    ...allCrud("ticket"),
    ...allCrud("category"),
    ...allCrud("service"),
    ...allCrud("partner"),
    P.ESTIMATE_CREATE, P.ESTIMATE_READ, P.ESTIMATE_UPDATE,
    P.INVOICE_READ,
    P.PAYMENT_READ,
    P.CATEGORY_MANAGE,
    P.SERVICE_MANAGE,
    P.COUPON_MANAGE,
    P.PARTNER_MANAGE,
    P.CONVERSATION_MANAGE,
    P.FEEDBACK_MANAGE,
    P.NOTIFICATION_MANAGE,
    P.TERMS_MANAGE,
    P.SERVICE_AREA_MANAGE,
  ],

  [ROLES.SUPPORT_BILLING]: [
    P.CUSTOMER_READ, P.CUSTOMER_UPDATE,
    P.ENQUIRY_READ, P.ENQUIRY_UPDATE,
    P.BOOKING_READ, P.BOOKING_UPDATE,
    P.WORK_ORDER_READ, P.WORK_ORDER_UPDATE,
    P.ESTIMATE_READ,
    ...allCrud("invoice"),
    ...allCrud("payment"),
    P.NOTIFICATION_MANAGE,
  ],

  [ROLES.MARKETING]: [
    P.CUSTOMER_READ,
    P.ENQUIRY_CREATE, P.ENQUIRY_READ, P.ENQUIRY_UPDATE,
    P.BOOKING_READ,
    P.COUPON_MANAGE,
    P.CONVERSATION_MANAGE,
    P.FEEDBACK_MANAGE,
    P.NOTIFICATION_MANAGE,
  ],

  [ROLES.INVESTOR]: [
    P.CUSTOMER_READ,
    P.ENQUIRY_READ,
    P.BOOKING_READ,
    P.WORK_ORDER_READ,
    P.ESTIMATE_READ,
    P.INVOICE_READ,
    P.PAYMENT_READ,
    P.FEEDBACK_MANAGE,
  ],
});
