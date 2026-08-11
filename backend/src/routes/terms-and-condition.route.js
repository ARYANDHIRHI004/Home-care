import { Router } from "express";
import * as controller from "../controllers/termsAndCondition.controller.js";
import { requireAuth } from "../middleware/auth.middleware.js";
import { requirePermission } from "../middleware/permission.middleware.js";
import { PERMISSIONS as P } from "../constants/permissions.js";

const router = Router();
router.use(requireAuth);
router.post("/", requirePermission(P.TERMS_MANAGE), controller.createTerms);
router.get("/", requirePermission(P.TERMS_MANAGE), controller.getTerms);
router.get("/category/:categoryId/active", requirePermission(P.TERMS_MANAGE), controller.getActiveTermsByCategory);
router.get("/:id", requirePermission(P.TERMS_MANAGE), controller.getTermsById);
router.patch("/:id", requirePermission(P.TERMS_MANAGE), controller.updateTerms);
router.patch("/:id/activate", requirePermission(P.TERMS_MANAGE), controller.activateTerms);
export default router;
