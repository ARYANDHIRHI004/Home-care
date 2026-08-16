import { Router } from "express";
import { updateCustomerProfile } from "../controllers/auth/customerProfile.controller.js";
import { requireAuth } from "../middleware/auth.middleware.js";

const router = Router();
router.use(requireAuth);
router.patch("/profile", updateCustomerProfile);
export default router;
