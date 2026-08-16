import { Router } from "express";
import * as controller from "../controllers/serviceArea.controller.js";
import { requireAuth } from "../middleware/auth.middleware.js";
import { requirePermission } from "../middleware/permission.middleware.js";
import { PERMISSIONS as P } from "../constants/permissions.js";

const router = Router();

// Public — called from customer checkout (and the profile onboarding modal),
// which happens before requireAuth's session model is necessarily involved.
router.get("/", controller.getServiceAreas);
router.post("/check", controller.checkServiceArea);
router.post("/notify-me", controller.notifyMeWhenAvailable);

// Admin management, gated like every other office-side resource.
router.use(requireAuth);
router.post("/", requirePermission(P.SERVICE_AREA_MANAGE), controller.createServiceArea);
router.get("/:id", requirePermission(P.SERVICE_AREA_MANAGE), controller.getServiceAreaById);
router.patch("/:id", requirePermission(P.SERVICE_AREA_MANAGE), controller.updateServiceArea);
router.delete("/:id", requirePermission(P.SERVICE_AREA_MANAGE), controller.deleteServiceArea);

export default router;
