import { TicketModel } from "../models/ticket.model.js";
import { UserModel } from "../models/user.model.js";
import winston from "winston";

// Create a new ticket
export const createTicket = async (req, res) => {
	try {
		const { subject, message, priority, userId } = req.body;

		// Validate user exists
		const user = await UserModel.findById(userId);
		if (!user) {
			return res
				.status(404)
				.json({ success: false, message: "User not found" });
		}

		const newTicket = await TicketModel.create({
			subject,
			message,
			priority,
			user: userId,
		});

		return res.status(201).json({
			success: true,
			message: "Ticket created successfully",
			data: newTicket,
		});
	} catch (error) {
		winston.error(`Error creating ticket: ${error.message}`);
		return res.status(500).json({
			success: false,
			message: "Failed to create ticket",
			error: error.message,
		});
	}
};

// Get all tickets (admin)
export const getAllTickets = async (req, res) => {
	try {
		const tickets = await TicketModel.find()
			.populate("user", "firstName lastName email")
			.sort({ createdAt: -1 });

		return res.status(200).json({
			success: true,
			count: tickets.length,
			data: tickets,
		});
	} catch (error) {
		winston.error(`Error fetching tickets: ${error.message}`);
		return res.status(500).json({
			success: false,
			message: "Failed to fetch tickets",
			error: error.message,
		});
	}
};

// Get tickets by user
export const getTicketsByUser = async (req, res) => {
	try {
		const { userId } = req.params;

		const tickets = await TicketModel.find({ user: userId }).sort({
			createdAt: -1,
		});

		return res.status(200).json({
			success: true,
			count: tickets.length,
			data: tickets,
		});
	} catch (error) {
		winston.error(`Error fetching user tickets: ${error.message}`);
		return res.status(500).json({
			success: false,
			message: "Failed to fetch user tickets",
			error: error.message,
		});
	}
};

// Get ticket by ID
export const getTicketById = async (req, res) => {
	try {
		const { id } = req.params;

		const ticket = await TicketModel.findById(id).populate(
			"user",
			"firstName lastName email"
		);

		if (!ticket) {
			return res.status(404).json({
				success: false,
				message: "Ticket not found",
			});
		}

		return res.status(200).json({
			success: true,
			data: ticket,
		});
	} catch (error) {
		winston.error(`Error fetching ticket: ${error.message}`);
		return res.status(500).json({
			success: false,
			message: "Failed to fetch ticket",
			error: error.message,
		});
	}
};

// Update ticket status (admin)
export const updateTicketStatus = async (req, res) => {
	try {
		const { id } = req.params;
		const { status } = req.body;

		const validStatuses = ["open", "in-progress", "resolved", "closed"];
		if (!validStatuses.includes(status)) {
			return res.status(400).json({
				success: false,
				message: "Invalid status value",
			});
		}

		const updatedTicket = await TicketModel.findByIdAndUpdate(
			id,
			{ status },
			{ new: true }
		);

		if (!updatedTicket) {
			return res.status(404).json({
				success: false,
				message: "Ticket not found",
			});
		}

		return res.status(200).json({
			success: true,
			message: "Ticket status updated successfully",
			data: updatedTicket,
		});
	} catch (error) {
		winston.error(`Error updating ticket status: ${error.message}`);
		return res.status(500).json({
			success: false,
			message: "Failed to update ticket status",
			error: error.message,
		});
	}
};

// Add response to ticket
export const addTicketResponse = async (req, res) => {
	try {
		const { id } = req.params;
		const { message, isAdmin } = req.body;

		const ticket = await TicketModel.findById(id);

		if (!ticket) {
			return res.status(404).json({
				success: false,
				message: "Ticket not found",
			});
		}

		ticket.responses.push({
			message,
			isAdmin: isAdmin || false,
		});

		// If admin is responding, update status to in-progress if it's open
		if (isAdmin && ticket.status === "open") {
			ticket.status = "in-progress";
		}

		await ticket.save();

		return res.status(200).json({
			success: true,
			message: "Response added successfully",
			data: ticket,
		});
	} catch (error) {
		winston.error(`Error adding ticket response: ${error.message}`);
		return res.status(500).json({
			success: false,
			message: "Failed to add response",
			error: error.message,
		});
	}
};

// Close ticket (user or admin)
export const closeTicket = async (req, res) => {
	try {
		const { id } = req.params;

		const updatedTicket = await TicketModel.findByIdAndUpdate(
			id,
			{ status: "closed" },
			{ new: true }
		);

		if (!updatedTicket) {
			return res.status(404).json({
				success: false,
				message: "Ticket not found",
			});
		}

		return res.status(200).json({
			success: true,
			message: "Ticket closed successfully",
			data: updatedTicket,
		});
	} catch (error) {
		winston.error(`Error closing ticket: ${error.message}`);
		return res.status(500).json({
			success: false,
			message: "Failed to close ticket",
			error: error.message,
		});
	}
};

// Delete ticket (admin only)
export const deleteTicket = async (req, res) => {
	try {
		const { id } = req.params;

		const deletedTicket = await TicketModel.findByIdAndDelete(id);

		if (!deletedTicket) {
			return res.status(404).json({
				success: false,
				message: "Ticket not found",
			});
		}

		return res.status(200).json({
			success: true,
			message: "Ticket deleted successfully",
		});
	} catch (error) {
		winston.error(`Error deleting ticket: ${error.message}`);
		return res.status(500).json({
			success: false,
			message: "Failed to delete ticket",
			error: error.message,
		});
	}
};

// Get ticket statistics (admin)
export const getTicketStats = async (req, res) => {
	try {
		const totalTickets = await TicketModel.countDocuments();
		const openTickets = await TicketModel.countDocuments({ status: "open" });
		const inProgressTickets = await TicketModel.countDocuments({
			status: "in-progress",
		});
		const resolvedTickets = await TicketModel.countDocuments({
			status: "resolved",
		});
		const closedTickets = await TicketModel.countDocuments({
			status: "closed",
		});

		// Get tickets by priority
		const highPriorityTickets = await TicketModel.countDocuments({
			priority: "high",
		});
		const urgentPriorityTickets = await TicketModel.countDocuments({
			priority: "urgent",
		});

		// Get recent tickets
		const recentTickets = await TicketModel.find()
			.sort({ createdAt: -1 })
			.limit(5)
			.populate("user", "firstName lastName email");

		return res.status(200).json({
			success: true,
			data: {
				totalTickets,
				openTickets,
				inProgressTickets,
				resolvedTickets,
				closedTickets,
				highPriorityTickets,
				urgentPriorityTickets,
				recentTickets,
			},
		});
	} catch (error) {
		winston.error(`Error fetching ticket stats: ${error.message}`);
		return res.status(500).json({
			success: false,
			message: "Failed to fetch ticket statistics",
			error: error.message,
		});
	}
};
