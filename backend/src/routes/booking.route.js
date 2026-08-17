import { Router } from "express";
import * as controller from "../controllers/booking.controller.js";
import { requireAuth } from "../middleware/auth.middleware.js";
import { requirePermission } from "../middleware/permission.middleware.js";
import { PERMISSIONS as P } from "../constants/permissions.js";

const router = Router();
router.use(requireAuth);
router.get("/me", controller.getMyBookings);
router.get("/me/:id", controller.getMyBookingById);
router.post("/", requirePermission(P.BOOKING_CREATE), controller.createBooking);
router.get("/", requirePermission(P.BOOKING_READ), controller.getBookings);
router.get("/:id", requirePermission(P.BOOKING_READ), controller.getBookingById);
router.patch("/:id", requirePermission(P.BOOKING_UPDATE), controller.updateBooking);
router.patch("/:id/status", requirePermission(P.BOOKING_UPDATE), controller.updateBookingStatus);
router.delete("/:id", requirePermission(P.BOOKING_DELETE), controller.deleteBooking);
export default router;
