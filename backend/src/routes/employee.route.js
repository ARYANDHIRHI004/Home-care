import { Router } from "express";
import * as controller from "../controllers/employee.controller.js";
import { requireAuth } from "../middleware/auth.middleware.js";
import { requirePermission } from "../middleware/permission.middleware.js";
import { PERMISSIONS as P } from "../constants/permissions.js";

const router = Router();
router.use(requireAuth);
router.post("/", requirePermission(P.EMPLOYEE_MANAGE), controller.createEmployee);
router.get("/", requirePermission(P.EMPLOYEE_MANAGE), controller.getEmployees);
router.get("/:id", requirePermission(P.EMPLOYEE_MANAGE), controller.getEmployeeById);
router.patch("/:id", requirePermission(P.EMPLOYEE_MANAGE), controller.updateEmployee);
router.patch("/:id/permissions", requirePermission(P.EMPLOYEE_MANAGE), controller.updatePermissions);
router.delete("/:id", requirePermission(P.EMPLOYEE_MANAGE), controller.deleteEmployee);
export default router;
