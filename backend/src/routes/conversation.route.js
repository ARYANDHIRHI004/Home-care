import { Router } from "express";
import * as controller from "../controllers/conversation.controller.js";
import { requireAuth } from "../middleware/auth.middleware.js";
import { requirePermission } from "../middleware/permission.middleware.js";
import { PERMISSIONS as P } from "../constants/permissions.js";

const router = Router();
router.use(requireAuth);
router.post("/", requirePermission(P.CONVERSATION_MANAGE), controller.createConversation);
router.get("/", requirePermission(P.CONVERSATION_MANAGE), controller.getConversations);
router.get("/:id", requirePermission(P.CONVERSATION_MANAGE), controller.getConversationById);
router.post("/:id/messages", requirePermission(P.CONVERSATION_MANAGE), controller.addMessage);
router.post("/:id/link-customer", requirePermission(P.CONVERSATION_MANAGE), controller.linkCustomerByPhone);
router.patch("/:id/status", requirePermission(P.CONVERSATION_MANAGE), controller.updateConversationStatus);
router.delete("/:id", requirePermission(P.CONVERSATION_MANAGE), controller.deleteConversation);
export default router;
