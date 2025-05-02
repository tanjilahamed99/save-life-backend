import mongoose from "mongoose";
const transactionSchema = new mongoose.Schema(
	{
		walletId: {
			type: mongoose.Schema.Types.ObjectId,
			ref: "Wallet",
			required: true,
		},
		userId: {
			type: mongoose.Schema.Types.ObjectId,
			ref: "User",
			required: true,
		},
		email: {
			type: String,
			required: true,
		},
		type: {
			type: String,
			enum: ["deposit", "withdrawal", "order_payment"],
			required: true,
		},
		amount: {
			type: Number,
			required: true,
		},
		status: {
			type: String,
			enum: ["pending", "completed", "failed", "cancelled"],
			default: "pending",
		},
		orderId: {
			type: mongoose.Schema.Types.ObjectId,
			ref: "Order",
		},
		paymentMethod: {
			type: String,
		},
		description: {
			type: String,
		},
		reference: {
			type: String,
		},
	},
	{ timestamps: true }
);

// const Transaction = mongoose.model("Transaction", transactionSchema);

export const TransactionModel = mongoose.model(
	"Transaction",
	transactionSchema
);
