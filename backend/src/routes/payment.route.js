import { Router } from "express";
import * as controller from "../controllers/payment.controller.js";
import { requireAuth } from "../middleware/auth.middleware.js";
import { requirePermission } from "../middleware/permission.middleware.js";
import { PERMISSIONS as P } from "../constants/permissions.js";

const router = Router();
router.use(requireAuth);
router.post("/", requirePermission(P.PAYMENT_CREATE), controller.createPayment);
router.get("/", requirePermission(P.PAYMENT_READ), controller.getPayments);
router.patch("/:id", requirePermission(P.PAYMENT_UPDATE), controller.updatePayment);
router.patch("/:id/verify", requirePermission(P.PAYMENT_UPDATE), controller.verifyPayment);
router.delete("/:id", requirePermission(P.PAYMENT_DELETE), controller.deletePayment);
export default router;
