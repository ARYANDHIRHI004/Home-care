import { Router } from "express";
import * as controller from "../controllers/termsAndCondition.controller.js";
import { requireAuth } from "../middleware/auth.middleware.js";
import { requirePermission } from "../middleware/permission.middleware.js";
import { PERMISSIONS as P } from "../constants/permissions.js";

const router = Router();

// Public routes
router.get("/", controller.getTerms);
router.get("/category/:categoryId/active", controller.getActiveTermsByCategory);
router.get("/:id", controller.getTermsById);

// Protected routes
router.use(requireAuth);
router.post("/", requirePermission(P.TERMS_MANAGE), controller.createTerms);
router.patch("/:id", requirePermission(P.TERMS_MANAGE), controller.updateTerms);
router.patch("/:id/activate", requirePermission(P.TERMS_MANAGE), controller.activateTerms);
export default router;
