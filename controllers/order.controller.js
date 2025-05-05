import { OrderModel } from "../models/order.model.js";
import { newOrderEmailTemplate } from "../static/email/newOrderEmailTemplate.js";
import { newOrderAdminTemplate } from "../static/email/newOrderAdminTemplate.js";
import { updateOrderEmailTemplate } from "../static/email/updateOrderEmailTemplate.js";
import { UserModel } from "../models/user.model.js";
import Email from "../lib/email/email.js";
import bcrypt from "bcryptjs";
import { sendBrevoCampaign } from "../lib/email/brevoEmail.js";

export const getAllOrders = async (req, res) => {
	const orders = await OrderModel.find({}).sort({ createdAt: -1 });

	res.json({ status: true, data: orders });
};

export const getOrderById = async (req, res) => {
	// const order = await OrderModel.findById(req.params.id);

	if (!req.params.id) {
		return res.send({
			message: "orderid required",
			success: false,
		});
	}

	const order = await OrderModel.findById({ _id: req.params.id });
	if (!order) {
		return res.json({ status: false, message: "Order not found" });
	}
	res.json({ status: true, data: order });
};

export const getOrderByCustomer = async (req, res) => {
	// show desc
	const orders = await OrderModel.find({ email: req.params.email }).sort({
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
		paymentStatus,
		paymentMethod,
		discountPrice,
	} = req.body;

	// Calculate total amount and verify stock
	let subtotal = 0;
	for (const item of items) {
		subtotal += item.price * item.quantity;
	}
	const fullName = firstName + " " + lastName;
	const userData = await UserModel.findOne({ email: user.email });

	const shipping = 5;

	const totalAmount = subtotal + shipping;

	const createOrder = {
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
		shipping,
		subtotal,
		paymentMethod,
		paymentStatus,
		site,
	};

	if (discountPrice) {
		createOrder.discountPrice = discountPrice;
	}

	const order = await OrderModel.create(createOrder);

	// const admins = await AdminModel.find({});

	const sendOrderEmail = async ({
		name,
		email,
		site,
		orderId,
		adminOrderLink,
		items,
		orderDate,
		support_url,
		totalAmount,
	}) => {
		// Prepare the HTML content for the user and admin email templates
		const htmlContentUser = await newOrderEmailTemplate({
			name,
			site,
			support_url,
			orderId,
		});

		const htmlContentAdmin = await newOrderAdminTemplate({
			name,
			email,
			items,
			site,
			totalAmount,
			orderId,
			adminOrderLink,
			orderDate,
		});

		// Create an array of promises to send emails in parallel
		const emailPromises = [
			new Email(user, site).sendEmailTemplate(
				htmlContentUser,
				"Ja! Uw bestelling is succesvol geplaatst!"
			),
			// sendBrevoCampaign({
			//   subject: "Ja! Uw bestelling is succesvol geplaatst!",
			//   senderName: "Benzobestellen",
			//   senderEmail: process.env.BREVO_EMAIL,
			//   htmlContent: htmlContentUser,
			//   to: user?.email,
			// }),

			new Email("", site).sendEmailTemplate(
				htmlContentAdmin,
				"Nieuwe bestelling plaatsen bij Admin"
			),
			// sendBrevoCampaign({
			//   subject: "Nieuwe bestelling plaatsen bij Admin",
			//   senderName: "Benzobestellen",
			//   senderEmail: process.env.BREVO_EMAIL,
			//   htmlContent: htmlContentAdmin,
			//   to: user?.email,
			// }),

			// ...admins
			//   .filter((admin) => admin.email !== 'admin@gmail.com')
			//   .map((admin) =>
			//     new Email(admin, site).sendEmailTemplate(
			//       htmlContentAdmin,
			//       'New Order Place to Admin'
			//     )
			//   ),
		];

		try {
			// Wait for both emails to be sent
			await Promise.all(emailPromises);
		} catch (err) {
			// Detailed error logging
			console.error("Error sending emails:", err);
			// Optional: Send failure notifications or handle retries
		}
	};

	// Usage:
	sendOrderEmail({
		name: userData?.name || fullName,
		email,
		items,
		site,
		totalAmount,
		orderId: order._id,
		adminOrderLink: "https://benzobestellen.com/admin",
		orderDate: order.createdAt,
		support_url:
			site === "https://benzobestellen.com"
				? "https://benzobestellen.com/contact"
				: "https://zolpidem-kopen.net/contact",
	});

	res.send({
		status: true,
		data: order,
		message: "Order created successfully",
	});
};
export const createCustomOrder = async (req, res) => {
	const {
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
		paymentStatus,
		paymentMethod,
	} = req.body;

	// Calculate total amount and verify stock
	let subtotal = 0;
	for (const item of items) {
		subtotal += item.price * item.quantity;
	}
	const fullName = firstName + " " + lastName;
	const userData = await UserModel.findOne({ email: email });

	let user;

	if (!userData) {
		const salt = await bcrypt.genSalt(10);
		const hashedPassword = await bcrypt.hash("1234", salt);

		// Create user
		user = await UserModel.create({
			name: fullName,
			email,
			password: hashedPassword,
		});
	}

	const shipping = 5;

	const totalAmount = subtotal + shipping;

	const order = await OrderModel.create({
		firstName,
		lastName,
		phone,
		user: userData || user,
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
		shipping,
		subtotal,
		paymentMethod,
		paymentStatus,
		site,
	});

	// const admins = await AdminModel.find({});

	const sendOrderEmail = async ({
		name,
		email,
		site,
		orderId,
		adminOrderLink,
		items,
		orderDate,
		support_url,
		totalAmount,
	}) => {
		// Prepare the HTML content for the user and admin email templates
		const htmlContentUser = await newOrderEmailTemplate({
			name,
			site,
			support_url,
			orderId,
		});

		const htmlContentAdmin = await newOrderAdminTemplate({
			name,
			email,
			items,
			site,
			totalAmount,
			orderId,
			adminOrderLink,
			orderDate,
		});

		// Create an array of promises to send emails in parallel
		const emailPromises = [
			new Email(userData || user, site).sendEmailTemplate(
				htmlContentUser,
				"Ja! Uw bestelling is succesvol geplaatst!"
			),

			new Email("", site).sendEmailTemplate(
				htmlContentAdmin,
				"Nieuwe bestelling plaatsen bij Admin"
			),

			// sendBrevoCampaign({
			//   subject: "Ja! Uw bestelling is succesvol geplaatst!",
			//   senderName: "Benzobestellen",
			//   senderEmail: process.env.BREVO_EMAIL,
			//   htmlContent: htmlContent,
			//   to: user?.email,
			// }),
			// sendBrevoCampaign({
			//   subject: "Nieuwe bestelling plaatsen bij Admin",
			//   senderName: "Benzobestellen",
			//   senderEmail: process.env.BREVO_EMAIL,
			//   htmlContent: htmlContent,
			//   to: user?.email,
			// }),

			// ...admins
			//   .filter((admin) => admin.email !== 'admin@gmail.com')
			//   .map((admin) =>
			//     new Email(admin, site).sendEmailTemplate(
			//       htmlContentAdmin,
			//       'New Order Place to Admin'
			//     )
			//   ),
		];

		try {
			// Wait for both emails to be sent
			await Promise.all(emailPromises);
		} catch (err) {
			// Detailed error logging
			console.error("Error sending emails:", err);
			// Optional: Send failure notifications or handle retries
		}
	};

	// Usage:
	sendOrderEmail({
		name: fullName,
		email,
		items,
		site,
		totalAmount,
		orderId: order._id,
		adminOrderLink: "https://benzobestellen.com/admin",
		orderDate: order.createdAt,
		support_url:
			site === "https://benzobestellen.com"
				? "https://benzobestellen.com/contact"
				: "https://zolpidem-kopen.net/contact",
	});

	res.send({
		status: true,
		data: order,
		message: "Order created successfully",
	});
};

export const orderUpdate = async (req, res) => {
	const { orderStatus, paymentStatus, site } = req.body;
	const { id } = req.params;

	const order = await OrderModel.findById({ _id: id });

	if (!order) {
		return res.send({ status: false, message: "Order not found" });
	}

	order.orderStatus = orderStatus;
	order.paymentStatus = paymentStatus;
	const { firstName, lastName, email, items, totalAmount } = order;

	const htmlContentUser = await updateOrderEmailTemplate({
		firstName,
		lastName,
		email,
		orderId: order._id,
		status: orderStatus,
		items,
		totalAmount,
	});

	try {
		await sendBrevoCampaign({
			subject: "order status update",
			senderName: "Benzobestellen",
			senderEmail: process.env.BREVO_EMAIL, // Use your Brevo verified email
			htmlContent: htmlContentUser,
			to: email,
		});
	} catch (err) {
		console.log(err);
	}

	const updatedOrder = await order.save();
	res
		.status(200)
		.send({ status: true, data: updatedOrder, message: "Order updated" });
};

export const deleteOrder = async (req, res) => {
	const { id } = req.params;

	if (!id) {
		return res.send({
			success: false,
			message: "order id required",
		});
	}
	const result = await OrderModel.deleteOne({ _id: id });
	res.status(200).send({ status: true, result, message: "Order deleted" });
};

export const getDiscount = async (req, res) => {
	try {
		const { discountCode } = req.body;

		if (!discountCode) {
			return res.send({
				success: false,
				message: "invalid request body",
			});
		}

		// static discount code
		const adminDiscount = "Welkom10";

		if (discountCode !== adminDiscount) {
			return res.send({
				success: false,
				message: "Kortingscode komt niet overeen",
			});
		}

		// static discount
		return res.send({
			success: true,
			discount: 10,
		});
	} catch (error) {
		console.log(error);
	}
};
