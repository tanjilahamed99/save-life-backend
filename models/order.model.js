import mongoose from "mongoose";

const orderSchema = new mongoose.Schema({
	user: {
		type: mongoose.Schema.Types.ObjectId,
		ref: "User",
	},
	email: {
		type: String,
		required: true,
	},
	items: [
		{
			id: {
				type: String,
				required: true,
			},
			name: {
				type: String,
				required: true,
			},
			price: {
				type: Number,
				required: true,
			},
			image: {
				type: String,
			},
			quantity: {
				type: Number,
				required: true,
				min: 1,
			},
		},
	],
	totalAmount: {
		type: Number,
		required: true,
	},
	status: {
		type: String,
		enum: ["pending", "processing", "shipped", "delivered", "cancelled"],
		default: "pending",
	},
	street: String,
	city: String,
	postalCode: String,
	paymentMethod: {
		type: String,
		enum: ["ideal", "bancontact", "bitcoin"],
		default: "ideal",
	},
	paymentStatus: {
		type: String,
		enum: ["pending", "completed", "failed"],
		default: "pending",
	},
	site: {
		type: String,
	},
	createdAt: {
		type: Date,
		default: Date.now,
	},
	updatedAt: {
		type: Date,
		default: Date.now,
	},
});

orderSchema.pre("save", function (next) {
	this.updatedAt = new Date();
	next();
});
export const OrderModel = mongoose.model("Order", orderSchema);
