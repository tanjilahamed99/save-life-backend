import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
	name: {
		type: String,
		required: true,
	},
	email: {
		type: String,
		required: true,
		unique: true,
	},
	password: {
		type: String,
		required: true,
	},
	role: {
		type: String,
		enum: ["admin", "customer"],
		default: "customer",
	},
	status: {
		type: String,
		enum: ["active", "inactive"],
		default: "active",
	},
	phone: String,
	address: String,
	totalOrders: {
		type: Number,
		default: 0,
	},
	totalSpent: {
		type: Number,
		default: 0,
	},
	otp: Number,
	createdAt: {
		type: Date,
		default: Date.now,
	},
	updatedAt: {
		type: Date,
		default: Date.now,
	},
});

export const UserModel = mongoose.model("User", userSchema);
