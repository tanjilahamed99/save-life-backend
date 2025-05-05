import express from "express";
import {
	addTicketResponse,
	closeTicket,
	createTicket,
	deleteTicket,
	getAllTickets,
	getTicketById,
	getTicketsByUser,
	getTicketStats,
	updateTicketStatus,
} from "../controllers/ticket.controller.js";

const router = express.Router();

// Create a new ticket
router.post("/create", createTicket);

// Get all tickets (admin)
router.get("/all", getAllTickets);

// Get tickets by user
router.get("/user/:userId", getTicketsByUser);

// Get ticket by ID
router.get("/:id", getTicketById);
 
// Update ticket status (admin)
router.put("/status/:id", updateTicketStatus);

// Add response to ticket
router.post("/response/:id", addTicketResponse);

// Close ticket
router.put("/close/:id", closeTicket);

// Delete ticket (admin)
router.delete("/:id", deleteTicket);

// Get ticket statistics (admin)
router.get("/stats/summary", getTicketStats);

export const ticketRoutes = router;
