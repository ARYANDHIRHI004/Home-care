import { Router } from "express";
import {
    adminLogin,
    adminLogout,
    getAdminProfile,
} from "../controllers/auth/adminAuth.controller.js";
import adminAuth from "../middlewares/adminAuth.js";

const router = Router();

/**
 * @route   POST /api/admin/auth/login
 * @desc    Admin email + password login
 * @access  Public
 */
router.post("/auth/login", adminLogin);

/**
 * @route   POST /api/admin/auth/logout
 * @desc    Revoke current admin session
 * @access  Protected (admin only)
 */
router.post("/auth/logout", adminAuth, adminLogout);

/**
 * @route   GET /api/admin/auth/me
 * @desc    Get authenticated admin profile
 * @access  Protected (admin only)
 */
router.get("/auth/me", adminAuth, getAdminProfile);

export default router;
