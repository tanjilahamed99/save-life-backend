import mongoose from "mongoose";

const orderEditHistorySchema = new mongoose.Schema(
	{
		orderId: {
			type: mongoose.Schema.Types.ObjectId,
			ref: "Order",
			required: true,
		},
		userId: {
			type: mongoose.Schema.Types.ObjectId,
			ref: "User",
		},
		changes: {
			type: Object,
			required: true,
		},
		previousState: {
			type: Object,
			required: true,
		},
		newState: {
			type: Object,
			required: true,
		},
		editedAt: {
			type: Date,
			default: Date.now,
		},
	},
	{ timestamps: true }
);

export const OrderEditHistoryModel = mongoose.model(
	"OrderEditHistory",
	orderEditHistorySchema
);
