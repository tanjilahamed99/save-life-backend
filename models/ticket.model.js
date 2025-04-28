import mongoose from "mongoose";

const ticketSchema = new mongoose.Schema(
	{
		subject: {
			type: String,
			required: [true, "Subject is required"],
			trim: true,
		},
		message: {
			type: String,
			required: [true, "Message is required"],
			trim: true,
		},
		status: {
			type: String,
			enum: ["open", "in-progress", "resolved", "closed"],
			default: "open",
		},
		priority: {
			type: String,
			enum: ["low", "medium", "high", "urgent"],
			default: "medium",
		},
		user: {
			type: mongoose.Schema.Types.ObjectId,
			ref: "User",
			required: true,
		},
		responses: [
			{
				message: {
					type: String,
					required: true,
				},
				isAdmin: {
					type: Boolean,
					default: false,
				},
				createdAt: {
					type: Date,
					default: Date.now,
				},
			},
		],
	},
	{ timestamps: true }
);

export const TicketModel = mongoose.model("Ticket", ticketSchema);
