import { Router } from "express";
import * as controller from "../controllers/faq.controller.js";
import { requireAuth, optionalAuth } from "../middleware/auth.middleware.js";
import { requirePermission } from "../middleware/permission.middleware.js";
import { PERMISSIONS as P } from "../constants/permissions.js";

const router = Router();

// Public routes. GET uses optionalAuth (not requireAuth) so an anonymous
// visitor isn't rejected — getFaqs itself decides how much to show based on
// whether req.user turned out to be an office staff member.
router.get("/", optionalAuth, controller.getFaqs);
router.get("/:id", controller.getFaqById);
router.post("/suggest", controller.suggestFaq);

// Protected routes — office staff only
router.use(requireAuth);
router.post("/", requirePermission(P.SETTINGS_MANAGE), controller.createFaq);
router.patch("/:id", requirePermission(P.SETTINGS_MANAGE), controller.updateFaq);
router.patch("/:id/toggle", requirePermission(P.SETTINGS_MANAGE), controller.toggleFaq);
router.delete("/:id", requirePermission(P.SETTINGS_MANAGE), controller.deleteFaq);

export default router;
