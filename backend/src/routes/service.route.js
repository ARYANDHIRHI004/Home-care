import { Router } from "express";
import * as controller from "../controllers/service.controller.js";
import { requireAuth } from "../middleware/auth.middleware.js";
import { requirePermission } from "../middleware/permission.middleware.js";
import { PERMISSIONS as P } from "../constants/permissions.js";

const router = Router();

// Public routes
router.get("/", controller.getServices);
router.get("/:id", controller.getServiceById);

// Protected routes
router.use(requireAuth);
router.post("/", requirePermission(P.SERVICE_MANAGE), controller.createService);
router.patch("/:id", requirePermission(P.SERVICE_MANAGE), controller.updateService);
router.patch("/:id/toggle", requirePermission(P.SERVICE_MANAGE), controller.toggleService);
router.delete("/:id", requirePermission(P.SERVICE_MANAGE), controller.deleteService);
export default router;
