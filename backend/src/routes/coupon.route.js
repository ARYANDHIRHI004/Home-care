import { Router } from "express";
import * as controller from "../controllers/coupon.controller.js";
import { requireAuth } from "../middleware/auth.middleware.js";
import { requirePermission } from "../middleware/permission.middleware.js";
import { PERMISSIONS as P } from "../constants/permissions.js";

const router = Router();
router.use(requireAuth);
router.post("/", requirePermission(P.COUPON_MANAGE), controller.createCoupon);
router.get("/", requirePermission(P.COUPON_MANAGE), controller.getCoupons);
router.get("/:id", requirePermission(P.COUPON_MANAGE), controller.getCouponById);
router.patch("/:id", requirePermission(P.COUPON_MANAGE), controller.updateCoupon);
router.patch("/:id/status", requirePermission(P.COUPON_MANAGE), controller.updateCouponStatus);
router.delete("/:id", requirePermission(P.COUPON_MANAGE), controller.deleteCoupon);
export default router;
