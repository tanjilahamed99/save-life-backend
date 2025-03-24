import { OrderModel } from "../models/order.model.js";
import nodemailer from "nodemailer";

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

	// Send email notification to admin
	const transporter = nodemailer.createTransport({
		host: "smtp.gmail.com.",
		port: 587,
		secure: false,
		auth: {
			user: "benzobestellen.net@gmail.com",
			// pass: "immouoveevzbttrj",
			pass: "frtusrcdpgoybgkb",
		},
		tls: {
			rejectUnauthorized: false,
		},
	});

	var mainOptions = {
		from: "zolpidemkopen.net@gmail.com",
		to: "sajibsarker.dev@gmail.com",
		subject: "New Order Placed",
		html: `
		<div>
			<h1>Order Placed</h1>
			<h2>Order ID: ${Date.now()}</h2>
			<h2>Customer Name: ${firstName} ${lastName}</h2>
			<h2>Customer Email: ${email}</h2>
			<h2>Customer Address: ${address}</h2>
			<h2>Customer City: ${city}</h2>
			<h2>Customer Country: ${country}</h2>
			<h2>Customer Postal Code: ${postalCode}</h2>
			<h2>Customer Phone: ${phone}</h2>
			<h2>Customer Site: ${site}</h2>
			<h2>Order Items: ${items.map((item) => item.name).join(", ")}</h2>
			<h2>Total Amount: ${totalAmount}</h2>
		</div>
		`,
	};

	await new Promise((resolve, reject) => {
		transporter.sendMail(mainOptions, (err, info) => {
			if (err) {
				console.error(err);
				reject(err);
			} else {
				resolve(info);
				console.log("sended");
			}
		});
	});

	// const sendMail = await sendEmail();

	const order = await OrderModel.create({
		firstName,
		lastName,
		phone,
		user,
		email,
		items: items.map((item) => ({
			...item,
			price: item.price,
		})),
		totalAmount,
		address,
		city,
		postalCode,
		country,
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
