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

export const orderUpdate = async (req, res) => {
	const {
		id,
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
	// check order exist or not

	const order = await OrderModel.findById(id);
	if (!order) {
		return res.send({ status: false, message: "Order not found" });
	}

	order.user = user;
	order.email = email;
	order.firstName = firstName;
	order.lastName = lastName;
	order.address = address;
	order.city = city;
	order.country = country;
	order.postalCode = postalCode;
	order.phone = phone;
	order.items = items;
	order.totalAmount = items.reduce(
		(acc, item) => acc + item.price * item.quantity,
		0
	);

	const updatedOrder = await order.save();

	res.send({ status: true, data: updatedOrder, message: "Order updated" });
};
