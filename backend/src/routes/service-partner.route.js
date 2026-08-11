import { Router } from "express";
import * as controller from "../controllers/servicePartner.controller.js";
import { requireAuth } from "../middleware/auth.middleware.js";
import { requirePermission } from "../middleware/permission.middleware.js";
import { PERMISSIONS as P } from "../constants/permissions.js";

const router = Router();
router.use(requireAuth);
router.post("/", requirePermission(P.PARTNER_MANAGE), controller.createPartner);
router.get("/", requirePermission(P.PARTNER_MANAGE), controller.getPartners);
router.get("/:id", requirePermission(P.PARTNER_MANAGE), controller.getPartnerById);
router.patch("/:id", requirePermission(P.PARTNER_MANAGE), controller.updatePartner);
router.patch("/:id/toggle", requirePermission(P.PARTNER_MANAGE), controller.togglePartner);
router.delete("/:id", requirePermission(P.PARTNER_MANAGE), controller.deletePartner);
export default router;
