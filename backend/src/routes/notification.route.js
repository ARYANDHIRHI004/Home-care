import { Router } from "express";
import * as controller from "../controllers/notification.controller.js";
import { requireAuth } from "../middleware/auth.middleware.js";
import { requirePermission } from "../middleware/permission.middleware.js";
import { PERMISSIONS as P } from "../constants/permissions.js";

const router = Router();
router.use(requireAuth);
router.get("/me", controller.getMyNotifications);
router.patch("/me/:id/read", controller.markMyNotificationRead);
router.patch("/me/read-all", controller.markAllMyNotificationsRead);
router.post("/", requirePermission(P.NOTIFICATION_MANAGE), controller.createNotification);
router.get("/", requirePermission(P.NOTIFICATION_MANAGE), controller.getNotifications);
router.patch("/:id/sent", requirePermission(P.NOTIFICATION_MANAGE), controller.markAsSent);
router.patch("/:id/failed", requirePermission(P.NOTIFICATION_MANAGE), controller.markAsFailed);
router.delete("/:id", requirePermission(P.NOTIFICATION_MANAGE), controller.deleteNotification);
export default router;
