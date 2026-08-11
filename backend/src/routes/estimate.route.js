import { Router } from "express";
import * as controller from "../controllers/estimate.controller.js";
import { requireAuth } from "../middleware/auth.middleware.js";
import { requirePermission } from "../middleware/permission.middleware.js";
import { PERMISSIONS as P } from "../constants/permissions.js";

const router = Router();
router.use(requireAuth);
router.post("/", requirePermission(P.ESTIMATE_CREATE), controller.createEstimate);
router.get("/", requirePermission(P.ESTIMATE_READ), controller.getEstimates);
router.get("/:id", requirePermission(P.ESTIMATE_READ), controller.getEstimateById);
router.patch("/:id", requirePermission(P.ESTIMATE_UPDATE), controller.updateEstimate);
router.patch("/:id/approval", requirePermission(P.ESTIMATE_UPDATE), controller.updateApprovalStatus);
router.delete("/:id", requirePermission(P.ESTIMATE_DELETE), controller.deleteEstimate);
export default router;
