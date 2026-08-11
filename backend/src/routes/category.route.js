import { Router } from "express";
import * as controller from "../controllers/category.controller.js";
import { requireAuth } from "../middleware/auth.middleware.js";
import { requirePermission } from "../middleware/permission.middleware.js";
import { PERMISSIONS as P } from "../constants/permissions.js";

const router = Router();
router.use(requireAuth);
router.post("/", requirePermission(P.CATEGORY_MANAGE), controller.createCategory);
router.get("/", requirePermission(P.CATEGORY_MANAGE), controller.getCategories);
router.get("/:id", requirePermission(P.CATEGORY_MANAGE), controller.getCategoryById);
router.patch("/:id", requirePermission(P.CATEGORY_MANAGE), controller.updateCategory);
router.delete("/:id", requirePermission(P.CATEGORY_MANAGE), controller.deleteCategory);
export default router;
