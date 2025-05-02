import mongoose from "mongoose";

const walletSchema = new mongoose.Schema(
	{
		userId: {
			type: mongoose.Schema.Types.ObjectId,
			ref: "User",
			required: true,
		},
		email: {
			type: String,
			required: true,
		},
		balance: {
			type: Number,
			default: 0,
			min: 0,
		},
	},
	{ timestamps: true }
);

export const WalletsModel = mongoose.model("Wallet", walletSchema);
