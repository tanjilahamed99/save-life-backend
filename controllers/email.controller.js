import sendEmail from "../lib/email/sendEmail.js";
import { OrderModel } from "../models/order.model.js";
import { UserModel } from "../models/user.model.js";

export const paymentRequest = async (req, res) => {
	const { orderId, pay_amount, expiry_date, payment_url } = req.body;

	// Check if order ID and message is provided
	if (!orderId) {
		return res
			.status(201)
			.send({ status: false, message: "Order ID is required" });
	}

	// // Check if order exists
	const order = await OrderModel.findById(orderId);

	if (!order) {
		return res.status(201).send({ status: false, message: "Order not found" });
	}

	const { email } = await UserModel.findById(order.user);

	if (!email) {
		return res.status(201).send({ status: false, message: "User not found" });
	}
	// // Send payment request email
	await sendEmail(
		"betaling voor zolpidem 10mg kopen", //subject
		"payment_request", //template_name
		pay_amount,
		payment_url,
		expiry_date,
		email
	);

	res.send({ status: true, message: "Payment email sent" });
};
