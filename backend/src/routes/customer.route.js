import { Router } from "express";
import * as controller from "../controllers/customer.controller.js";
import { requireAuth } from "../middleware/auth.middleware.js";
import { requirePermission } from "../middleware/permission.middleware.js";
import { PERMISSIONS as P } from "../constants/permissions.js";

const router = Router();
router.use(requireAuth);
router.get("/me/addresses", controller.getMyAddresses);
router.post("/me/addresses", controller.addMyAddress);
router.delete("/me/addresses/:addressId", controller.deleteMyAddress);
router.post("/find-or-create", requirePermission(P.CUSTOMER_CREATE), controller.findOrCreateByPhone);
router.post("/", requirePermission(P.CUSTOMER_CREATE), controller.createCustomer);
router.get("/", requirePermission(P.CUSTOMER_READ), controller.getCustomers);
router.get("/:id", requirePermission(P.CUSTOMER_READ), controller.getCustomerById);
router.patch("/:id", requirePermission(P.CUSTOMER_UPDATE), controller.updateCustomer);
router.patch("/:id/verify-otp", requirePermission(P.CUSTOMER_UPDATE), controller.verifyCustomerOtp);
router.delete("/:id", requirePermission(P.CUSTOMER_DELETE), controller.deleteCustomer);
export default router;
