import { OrderModel } from "../models/order.model.js";

export const getAllOrders = async (req, res) => {
	const orders = await OrderModel.find({}).sort({ createdAt: -1 });
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
	// show desc
	const orders = await OrderModel.find({ user: req.params.id }).sort({
		createdAt: -1,
	});
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
		site,
	} = req.body;

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
		site,
	});

	res.send({
		status: true,
		data: order,
		message: "Order created successfully",
	});
};

export const orderUpdate = async (req, res) => {
	const {
		_id,

		status,
		paymentStatus,
	} = req.body;
	// check order exist or not

	const order = await OrderModel.findById({ _id });
	if (!order) {
		return res.send({ status: false, message: "Order not found" });
	}

	order.status = status;
	order.paymentStatus = paymentStatus;

	const updatedOrder = await order.save();

	res
		.status(200)
		.send({ status: true, data: updatedOrder, message: "Order updated" });
};
