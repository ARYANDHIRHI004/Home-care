import { Router } from "express";
import * as controller from "../controllers/feedback.controller.js";
import { requireAuth } from "../middleware/auth.middleware.js";
import { requirePermission } from "../middleware/permission.middleware.js";
import { PERMISSIONS as P } from "../constants/permissions.js";

const router = Router();
router.use(requireAuth);
router.post("/", requirePermission(P.FEEDBACK_MANAGE), controller.createFeedback);
router.get("/", requirePermission(P.FEEDBACK_MANAGE), controller.getFeedback);
router.get("/:id", requirePermission(P.FEEDBACK_MANAGE), controller.getFeedbackById);
router.delete("/:id", requirePermission(P.FEEDBACK_MANAGE), controller.deleteFeedback);
export default router;
