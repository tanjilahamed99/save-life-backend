import mongoose from "mongoose";

const notificationSchema = new mongoose.Schema({
	userId: {
		type: String,
		required: true,
		index: true,
	},
	message: {
		type: String,
		required: true,
	},
	type: {
		type: String,
		enum: ["payment", "order", "shipping", "general"],
		default: "payment",
	},
	actionUrl: {
		type: String,
		default: null,
	},
	orderId: {
		type: mongoose.Schema.Types.ObjectId,
		ref: "Order",
		default: null,
	},
	expiryDate: {
		type: Date,
		default: null,
	},
	isRead: {
		type: Boolean,
		default: false,
	},
	createdAt: {
		type: Date,
		default: Date.now,
	},
});

export const NotificationModel = mongoose.model(
	"Notification",
	notificationSchema
);
