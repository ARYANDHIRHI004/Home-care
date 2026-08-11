import { Router } from "express";
import * as controller from "../controllers/ticket.controller.js";
import { requireAuth } from "../middleware/auth.middleware.js";
import { requirePermission } from "../middleware/permission.middleware.js";
import { PERMISSIONS as P } from "../constants/permissions.js";

const router = Router();
router.use(requireAuth);
router.post("/", requirePermission(P.TICKET_CREATE), controller.createTicket);
router.get("/", requirePermission(P.TICKET_READ), controller.getTickets);
router.get("/:id", requirePermission(P.TICKET_READ), controller.getTicketById);
router.patch("/:id/status", requirePermission(P.TICKET_UPDATE), controller.updateTicketStatus);
router.patch("/:id/assign", requirePermission(P.TICKET_UPDATE), controller.assignPartner);
router.post("/:id/notes", requirePermission(P.TICKET_UPDATE), controller.addTicketNote);
router.delete("/:id", requirePermission(P.TICKET_DELETE), controller.deleteTicket);
export default router;
