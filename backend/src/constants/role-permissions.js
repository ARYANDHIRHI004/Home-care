import { ROLES } from "../enum/role.enum.js";
import { PERMISSIONS as P } from "./permissions.js";

const allCrud = (resource) => [
  `${resource}:create`,
  `${resource}:read`,
  `${resource}:update`,
  `${resource}:delete`,
];

export const ROLE_PERMISSIONS = Object.freeze({
  [ROLES.SUPER_ADMIN]: Object.values(P),

  [ROLES.OPS_EXECUTIVE]: [
    ...allCrud("customer"),
    ...allCrud("enquiry"),
    ...allCrud("work_order"),
    P.ESTIMATE_CREATE, P.ESTIMATE_READ, P.ESTIMATE_UPDATE,
    P.INVOICE_READ,
    P.PAYMENT_READ,
    P.CATEGORY_MANAGE,
    P.SERVICE_MANAGE,
    P.PARTNER_MANAGE,
    P.CONVERSATION_MANAGE,
    P.FEEDBACK_MANAGE,
    P.NOTIFICATION_MANAGE,
    P.TERMS_MANAGE,
  ],

  [ROLES.SUPPORT_BILLING]: [
    P.CUSTOMER_READ, P.CUSTOMER_UPDATE,
    P.ENQUIRY_READ, P.ENQUIRY_UPDATE,
    P.WORK_ORDER_READ, P.WORK_ORDER_UPDATE,
    P.ESTIMATE_READ,
    ...allCrud("invoice"),
    ...allCrud("payment"),
    P.NOTIFICATION_MANAGE,
  ],

  [ROLES.MARKETING]: [
    P.CUSTOMER_READ,
    P.ENQUIRY_CREATE, P.ENQUIRY_READ, P.ENQUIRY_UPDATE,
    P.CONVERSATION_MANAGE,
    P.FEEDBACK_MANAGE,
    P.NOTIFICATION_MANAGE,
  ],

  [ROLES.INVESTOR]: [
    P.CUSTOMER_READ,
    P.ENQUIRY_READ,
    P.WORK_ORDER_READ,
    P.ESTIMATE_READ,
    P.INVOICE_READ,
    P.PAYMENT_READ,
    P.FEEDBACK_MANAGE,
  ],
});
