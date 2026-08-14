import { Router } from "express";
import * as controller from "../controllers/work-order.controller.js";
import { requireAuth } from "../middleware/auth.middleware.js";
import { requirePermission } from "../middleware/permission.middleware.js";
import { PERMISSIONS as P } from "../constants/permissions.js";

const router = Router();
router.use(requireAuth);
router.post("/", requirePermission(P.WORK_ORDER_CREATE), controller.createWorkOrder);
router.get("/", requirePermission(P.WORK_ORDER_READ), controller.getWorkOrders);
router.get("/:id", requirePermission(P.WORK_ORDER_READ), controller.getWorkOrderById);
router.patch("/:id/status", requirePermission(P.WORK_ORDER_UPDATE), controller.updateWorkOrderStatus);
router.patch("/:id/assign", requirePermission(P.WORK_ORDER_UPDATE), controller.assignPartner);
router.post("/:id/notes", requirePermission(P.WORK_ORDER_UPDATE), controller.addWorkOrderNote);
router.delete("/:id", requirePermission(P.WORK_ORDER_DELETE), controller.deleteWorkOrder);
export default router;
