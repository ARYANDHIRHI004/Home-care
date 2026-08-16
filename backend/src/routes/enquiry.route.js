import { Router } from "express";
import * as controller from "../controllers/enquiry.controller.js";
import { requireAuth } from "../middleware/auth.middleware.js";
import { requirePermission } from "../middleware/permission.middleware.js";
import { PERMISSIONS as P } from "../constants/permissions.js";

const router = Router();
router.use(requireAuth);
router.get("/me", controller.getMyEnquiries);
router.post("/", requirePermission(P.ENQUIRY_CREATE), controller.createEnquiry);
router.get("/", requirePermission(P.ENQUIRY_READ), controller.getEnquiries);
router.get("/:id", requirePermission(P.ENQUIRY_READ), controller.getEnquiryById);
router.patch("/:id", requirePermission(P.ENQUIRY_UPDATE), controller.updateEnquiry);
router.post("/:id/notes", requirePermission(P.ENQUIRY_UPDATE), controller.addEnquiryNote);
router.delete("/:id", requirePermission(P.ENQUIRY_DELETE), controller.deleteEnquiry);
export default router;
