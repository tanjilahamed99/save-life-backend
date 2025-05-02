import mongoose from "mongoose";

const emailHistorySchema = new mongoose.Schema(
	{
		order: {
			type: mongoose.Schema.Types.ObjectId,
			ref: "Order",
		},
		subject: {
			type: String,
			required: true,
		},
		body: {
			type: String,
			required: true,
		},
		recipient: {
			type: String,
			required: true,
		},
		sender: {
			type: String,
			required: true,
		},
		type: {
			type: String,
			enum: [
				"payment_request",
				"wallet_payment_request",
				"order_confirmation",
				"shipping_update",
				"order_delivered",
				"other",
			],
			default: "other",
		},
		sentAt: {
			type: Date,
			default: Date.now,
		},
	},
	{
		timestamps: true,
	}
);

export const EmailHistoryModel = mongoose.model(
	"EmailHistory",
	emailHistorySchema
);
