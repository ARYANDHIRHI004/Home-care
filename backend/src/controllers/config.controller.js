import * as E from '../constants/enums.js';

// GET /api/config/enums — one call, every status/enum a frontend <select> or
// filter needs. Values come from constants/enums.js (hand-verified against
// each model directly), not live schema introspection — that was tried here
// before and 500'd the whole endpoint the moment one field name was wrong
// (Invoice's real field is `paymentStatus`, not `status`; Customer has no
// `status` field at all). A stale constant is a much smaller failure mode
// than the entire endpoint going down.
export const getEnums = (req, res) => {
    try {
        const enums = {
            enquiry: {
                source: E.ENQUIRY_SOURCE,
                status: E.ENQUIRY_STATUS,
                timeSlots: E.TIME_SLOTS,
            },
            estimate: {
                status: E.ESTIMATE_STATUS,
                approvalStatus: E.ESTIMATE_APPROVAL_STATUS,
            },
            booking: {
                status: E.BOOKING_STATUS,
                paymentStatus: E.BOOKING_PAYMENT_STATUS,
            },
            workOrder: {
                status: E.WORK_ORDER_STATUS,
                priority: E.WORK_ORDER_PRIORITY,
            },
            complaint: {
                status: E.COMPLAINT_STATUS,
                priority: E.COMPLAINT_PRIORITY,
            },
            invoice: {
                status: E.INVOICE_STATUS,
            },
            payment: {
                method: E.PAYMENT_METHOD,
                status: E.PAYMENT_TRANSACTION_STATUS,
            },
            employee: {
                role: E.EMPLOYEE_ROLE,
            },
            coupon: {
                type: E.COUPON_TYPE,
                status: E.COUPON_STATUS,
            },
            expense: {
                paymentMethod: E.EXPENSE_PAYMENT_METHOD,
            },
            notification: {
                recipientType: E.NOTIFICATION_RECIPIENT_TYPE,
                channel: E.NOTIFICATION_CHANNEL,
                status: E.NOTIFICATION_STATUS,
            },
        };

        res.status(200).json(enums);
    } catch (error) {
        console.error('Error fetching enums:', error);
        res.status(500).json({ message: 'Failed to fetch configuration enums' });
    }
};
