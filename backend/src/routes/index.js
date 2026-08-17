import { Router } from "express";

import customerRoutes from "./customer.route.js";
import enquiryRoutes from "./enquiry.route.js";
import bookingRoutes from "./booking.route.js";
import workOrderRoutes from "./work-order.route.js";
import estimateRoutes from "./estimate.route.js";
import invoiceRoutes from "./invoice.route.js";
import paymentRoutes from "./payment.route.js";
import categoryRoutes from "./category.route.js";
import serviceRoutes from "./service.route.js";
import couponRoutes from "./coupon.route.js";
import partnerRoutes from "./service-partner.route.js";
import employeeRoutes from "./employee.route.js";
import conversationRoutes from "./conversation.route.js";
import feedbackRoutes from "./feedback.route.js";
import notificationRoutes from "./notification.route.js";
import settingRoutes from "./setting.route.js";
import termsRoutes from "./terms-and-condition.route.js";
import ticketRoutes from "./ticket.route.js";
import imagekitRoutes from "./imagekit.route.js";
import customerProfileRoutes from "./customerProfile.route.js";
import expenseRoutes from "./expense.route.js";
import configRoutes from "./config.routes.js";
import serviceAreaRoutes from "./serviceArea.route.js";
import faqRoutes from "./faq.route.js";

import { API_PATHS } from "../constants/api-paths.js";

const router = Router();

router.use(API_PATHS.CUSTOMERS, customerRoutes);
router.use(API_PATHS.ENQUIRIES, enquiryRoutes);
router.use(API_PATHS.BOOKINGS, bookingRoutes);
router.use(API_PATHS.WORK_ORDERS, workOrderRoutes);
router.use(API_PATHS.ESTIMATES, estimateRoutes);
router.use(API_PATHS.INVOICES, invoiceRoutes);
router.use(API_PATHS.PAYMENTS, paymentRoutes);
router.use(API_PATHS.CATEGORIES, categoryRoutes);
router.use(API_PATHS.SERVICES, serviceRoutes);
router.use(API_PATHS.COUPONS, couponRoutes);
router.use(API_PATHS.PARTNERS, partnerRoutes);
router.use(API_PATHS.EMPLOYEES, employeeRoutes);
router.use(API_PATHS.CONVERSATIONS, conversationRoutes);
router.use(API_PATHS.FEEDBACK, feedbackRoutes);
router.use(API_PATHS.NOTIFICATIONS, notificationRoutes);
router.use(API_PATHS.SETTINGS, settingRoutes);
router.use(API_PATHS.TERMS, termsRoutes);
router.use(API_PATHS.TICKETS, ticketRoutes);
router.use(API_PATHS.IMAGEKIT, imagekitRoutes);
router.use(API_PATHS.EXPENSES, expenseRoutes);
router.use(API_PATHS.CONFIG, configRoutes);
router.use(API_PATHS.SERVICE_AREAS, serviceAreaRoutes);
router.use(API_PATHS.FAQS, faqRoutes);
// Mounted at /api/auth/customer/* — safe alongside the Better Auth catch-all
// in app.js (app.post/app.get "/api/auth/{*any}"), since this router only
// registers a PATCH handler and Express falls through by method, not just path.
router.use("/auth/customer", customerProfileRoutes);

export default router;
