import { OrderModel } from "../models/order.model.js";

export const getAllOrders = async (req, res) => {
	const orders = await OrderModel.find({});
	if (!orders) {
		return res.json({ status: false, message: "No orders found" });
	}
	res.json({ status: true, data: orders });
};

export const getOrderById = async (req, res) => {
	const order = await OrderModel.findById(req.params.id);
	if (!order) {
		return res.json({ status: false, message: "Order not found" });
	}
	res.json({ status: true, data: order });
};

export const getOrderByCustomer = async (req, res) => {
	const orders = await OrderModel.find({ user: req.params.id });
	if (!orders) {
		return res.json({ status: false, message: "No orders found" });
	}
	res.json({ status: true, data: orders });
};

export const createOrder = async (req, res) => {
	const {
		user,
		email,
		firstName,
		lastName,
		address,
		city,
		country,
		postalCode,
		phone,
		items,
	} = req.body;
	console.log({ email });
	// Calculate total amount and verify stock
	let totalAmount = 0;
	for (const item of items) {
		totalAmount += item.price * item.quantity;
	}

	// const sendMail = await sendEmail();

	const order = await OrderModel.create({
		user: user?.payload,
		email,
		items: items.map((item) => ({
			...item,
			price: item.price,
		})),
		totalAmount,
		street: address,
		city,
		postalCode,
		paymentMethod: "ideal",
		paymentStatus: "pending",
	});

	res.send({
		status: true,
		data: order,
		message: "Order created successfully",
	});
};
