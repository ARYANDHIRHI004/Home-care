import { Router } from "express";
import * as controller from "../controllers/setting.controller.js";
import { requireAuth } from "../middleware/auth.middleware.js";
import { requirePermission } from "../middleware/permission.middleware.js";
import { PERMISSIONS as P } from "../constants/permissions.js";

const router = Router();
router.use(requireAuth);
router.get("/", requirePermission(P.SETTINGS_MANAGE), controller.getSettings);
router.put("/", requirePermission(P.SETTINGS_MANAGE), controller.createOrUpdateSettings);
router.patch("/invoice", requirePermission(P.SETTINGS_MANAGE), controller.updateInvoiceSettings);
router.patch("/whatsapp", requirePermission(P.SETTINGS_MANAGE), controller.updateWhatsAppSettings);
router.patch("/payment", requirePermission(P.SETTINGS_MANAGE), controller.updatePaymentSettings);
export default router;
