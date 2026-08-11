import { Router } from "express";
import * as controller from "../controllers/service.controller.js";
import { requireAuth } from "../middleware/auth.middleware.js";
import { requirePermission } from "../middleware/permission.middleware.js";
import { PERMISSIONS as P } from "../constants/permissions.js";

const router = Router();
router.use(requireAuth);
router.post("/", requirePermission(P.SERVICE_MANAGE), controller.createService);
router.get("/", requirePermission(P.SERVICE_MANAGE), controller.getServices);
router.get("/:id", requirePermission(P.SERVICE_MANAGE), controller.getServiceById);
router.patch("/:id", requirePermission(P.SERVICE_MANAGE), controller.updateService);
router.patch("/:id/toggle", requirePermission(P.SERVICE_MANAGE), controller.toggleService);
router.delete("/:id", requirePermission(P.SERVICE_MANAGE), controller.deleteService);
export default router;
