import { OrderModel } from "../models/order.model.js";
import { newOrderEmailTemplate } from "../static/email/newOrderEmailTemplate.js";
import { newOrderAdminTemplate } from "../static/email/newOrderAdminTemplate.js";
import { UserModel } from "../models/user.model.js";
import Email from "../lib/email/email.js";
import bcrypt from "bcryptjs";
import { OrderEditHistoryModel } from "../models/order-edit-history.model.js";
import mongoose from "mongoose";
import { NotificationModel } from "../models/notification.model.js";
import fetch from "node-fetch";

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

			new Email("", site).sendEmailTemplate(
				htmlContentAdmin,
				"Nieuwe bestelling plaatsen bij Admin"
			),
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
	try {
		const { id } = req.params;
		const { items, address, city, postalCode, country, notes, phone } =
			req.body;

		console.log("Received update request for order:", id);
		console.log("Update data:", req.body);

		// Validate the order ID
		if (!mongoose.Types.ObjectId.isValid(id)) {
			console.log("Invalid order ID format:", id);
			return res.status(400).json({
				status: false,
				message: "Invalid order ID format",
			});
		}

		// Find the order
		const order = await OrderModel.findById(id);

		if (!order) {
			console.log("Order not found:", id);
			return res.status(404).json({
				status: false,
				message: "Order not found",
			});
		}

		console.log("Found order:", order._id);

		// Check if order can be edited based on status
		const canEditQuantity =
			order.paymentStatus !== "paid" &&
			(order.orderStatus === "processing" || order.orderStatus === "pending");
		const canEditShipping = !["shipped", "delivered"].includes(
			order.orderStatus
		);

		console.log("Can edit quantity:", canEditQuantity);
		console.log("Can edit shipping:", canEditShipping);

		// Create update object and track changes
		const updateData = {};
		const changes = {};

		// Handle items update (only if not paid)
		if (items && Array.isArray(items)) {
			if (!canEditQuantity) {
				console.log("Cannot modify items for paid orders");
				return res.status(400).json({
					status: false,
					message: "Cannot modify items for orders that have already been paid",
				});
			}

			// Validate items structure
			const validItems = items.every(
				(item) =>
					item.id &&
					item.name &&
					typeof item.price === "number" &&
					typeof item.quantity === "number" &&
					item.quantity > 0
			);
			console.log(validItems);

			// if (!validItems) {
			// 	console.log("Invalid items structure");
			// 	return res.status(400).json({
			// 		status: false,
			// 		message: "Invalid items structure",
			// 	});
			// }

			updateData.items = items;
			changes.items = true;

			// Recalculate totals
			const subtotal = items.reduce(
				(sum, item) => sum + item.price * item.quantity,
				0
			);
			updateData.subtotal = subtotal;
			updateData.totalAmount = subtotal + (order.shipping || 5.0); // Default to 5.0 if shipping is not set
			changes.subtotal = true;
			changes.totalAmount = true;

			console.log("Updated items and recalculated totals");
		}

		// Handle shipping address update (only if not shipped)
		if (!canEditShipping && (address || city || postalCode || country)) {
			console.log("Cannot update shipping address for shipped orders");
			return res.status(400).json({
				status: false,
				message: "Cannot update shipping address for shipped orders",
			});
		}

		// Update shipping address fields if provided
		if (address) {
			updateData.address = address;
			changes.address = true;
			console.log("Updated address");
		}

		if (city) {
			updateData.city = city;
			changes.city = true;
			console.log("Updated city");
		}

		if (postalCode) {
			updateData.postalCode = postalCode;
			changes.postalCode = true;
			console.log("Updated postal code");
		}

		if (country) {
			updateData.country = country;
			changes.country = true;
			console.log("Updated country");
		}

		// Phone can always be updated
		if (phone) {
			updateData.phone = phone;
			changes.phone = true;
			console.log("Updated phone");
		}

		// Notes can always be updated
		if (notes !== undefined) {
			updateData.notes = notes;
			changes.notes = true;
			console.log("Updated notes");
		}

		// If nothing was changed
		if (Object.keys(changes).length === 0) {
			console.log("No changes were made to the order");
			return res.status(400).json({
				status: false,
				message: "No changes were made to the order",
			});
		}

		console.log("Updating order with data:", updateData);

		// Update the order
		const updatedOrder = await OrderModel.findByIdAndUpdate(
			id,
			{ $set: updateData },
			{ new: true }
		);

		if (!updatedOrder) {
			console.log("Failed to update order");
			return res.status(500).json({
				status: false,
				message: "Failed to update order",
			});
		}

		console.log("Order updated successfully:", updatedOrder._id);

		// Track order edit history
		try {
			await OrderEditHistoryModel.create({
				orderId: order._id,
				userId: req.user?._id || null,
				changes,
				previousState: {
					items: order.items,
					address: order.address,
					city: order.city,
					postalCode: order.postalCode,
					country: order.country,
					phone: order.phone,
					notes: order.notes,
					subtotal: order.subtotal,
					totalAmount: order.totalAmount,
				},
				newState: {
					items: updateData.items || order.items,
					address: updateData.address || order.address,
					city: updateData.city || order.city,
					postalCode: updateData.postalCode || order.postalCode,
					country: updateData.country || order.country,
					phone: updateData.phone || order.phone,
					notes: updateData.notes || order.notes,
					subtotal: updateData.subtotal || order.subtotal,
					totalAmount: updateData.totalAmount || order.totalAmount,
				},
			});
			console.log("Created order edit history record");
		} catch (historyError) {
			console.error("Error creating edit history:", historyError);
			// Continue execution even if history tracking fails
		}

		// Create a notification for the admin
		try {
			await NotificationModel.create({
				userId: order.user || "system",
				message: `Order #${order._id} was edited by customer`,
				type: "order",
				actionUrl: `/admin/orders/${order._id}`,
				orderId: order._id,
			});
			console.log("Created admin notification");
		} catch (notificationError) {
			console.error("Error creating notification:", notificationError);
			// Continue execution even if notification creation fails
		}

		// Send email notifications
		try {
			const apiUrl = process.env.API_URL || "http://localhost:4000";

			// Send email to customer
			fetch(`${apiUrl}/api/v1/email/order-edit-email`, {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
				},
				body: JSON.stringify({
					orderId: order._id,
					firstName: order.firstName || "Valued",
					lastName: order.lastName || "Customer",
					email: order.email,
					changes,
					items: updateData.items || order.items,
					totalAmount: updateData.totalAmount || order.totalAmount,
					site: order.site || "benzobestellen.com",
				}),
			}).catch((err) => console.error("Error sending customer email:", err));

			// Send email to admin
			fetch(`${apiUrl}/api/v1/email/order-edit-admin-email`, {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
				},
				body: JSON.stringify({
					orderId: order._id,
					customerName:
						`${order.firstName || ""} ${order.lastName || ""}`.trim() ||
						"Customer",
					customerEmail: order.email,
					changes,
					totalAmount: updateData.totalAmount || order.totalAmount,
					adminEmail: process.env.ADMIN_EMAIL || "me.mrsajib@gmail.com",
					site: order.site || "benzobestellen.com",
				}),
			}).catch((err) => console.error("Error sending admin email:", err));

			console.log("Sent email notifications");
		} catch (emailError) {
			console.error("Error sending notification emails:", emailError);
			// Don't fail the request if emails fail to send
		}

		return res.status(200).json({
			status: true,
			message: "Order updated successfully",
			data: updatedOrder,
			changes,
		});
	} catch (error) {
		console.error("Error updating order:", error);
		return res.status(500).json({
			status: false,
			message: "Server error",
			error: error.message,
		});
	}
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

/**
 * Update an order
 * This is the main endpoint used by the frontend to update orders
 */

// Keep the existing customerEditOrder function for backward compatibility
export const customerEditOrder = async (req, res) => {
	try {
		const { id } = req.params;
		const { items, address, city, postalCode, country, phone, notes } =
			req.body;
		const userId = req.user?._id; // Assuming you have authentication middleware

		// Find the order
		const order = await OrderModel.findById(id);

		if (!order) {
			return res.status(404).json({
				status: false,
				message: "Order not found",
			});
		}

		// Check if order belongs to the user (if user is authenticated)
		if (userId && order.user && order.user.toString() !== userId.toString()) {
			return res.status(403).json({
				status: false,
				message: "You are not authorized to edit this order",
			});
		}

		// Check if order can be edited (only processing orders)
		if (order.orderStatus !== "processing" && order.orderStatus !== "pending") {
			return res.status(400).json({
				status: false,
				message: "Only orders in processing or pending status can be edited",
			});
		}

		// Create update object
		const updateData = {};
		const changes = {};

		// Handle items update (only if not paid)
		if (items && order.paymentStatus !== "paid") {
			updateData.items = items;
			changes.items = true;

			// Recalculate totals
			const subtotal = items.reduce(
				(sum, item) => sum + item.price * item.quantity,
				0
			);
			updateData.subtotal = subtotal;
			updateData.totalAmount = subtotal + order.shipping;
			changes.subtotal = true;
			changes.totalAmount = true;
		} else if (items && order.paymentStatus === "paid") {
			return res.status(400).json({
				status: false,
				message: "Cannot modify items for orders that have already been paid",
			});
		}

		// Handle shipping address update (only if not shipped)
		if (["shipped", "delivered"].includes(order.orderStatus)) {
			// Cannot update shipping for shipped orders
			if (address || city || postalCode || country) {
				return res.status(400).json({
					status: false,
					message: "Cannot update shipping address for shipped orders",
				});
			}
		} else {
			// Can update shipping address
			if (address) {
				updateData.address = address;
				changes.address = true;
			}
			if (city) {
				updateData.city = city;
				changes.city = true;
			}
			if (postalCode) {
				updateData.postalCode = postalCode;
				changes.postalCode = true;
			}
			if (country) {
				updateData.country = country;
				changes.country = true;
			}
		}

		// Phone can always be updated
		if (phone) {
			updateData.phone = phone;
			changes.phone = true;
		}

		// Notes can always be updated
		if (notes !== undefined) {
			updateData.notes = notes;
			changes.notes = true;
		}

		// If nothing was changed
		if (Object.keys(changes).length === 0) {
			return res.status(400).json({
				status: false,
				message: "No changes were made to the order",
			});
		}

		// Update the order
		const updatedOrder = await OrderModel.findByIdAndUpdate(
			id,
			{ $set: updateData },
			{ new: true }
		);

		// Track order edit history
		try {
			await OrderEditHistoryModel.create({
				orderId: order._id,
				userId: req.user?._id || null,
				changes,
				previousState: {
					items: order.items,
					address: order.address,
					city: order.city,
					postalCode: order.postalCode,
					country: order.country,
					phone: order.phone,
					notes: order.notes,
					subtotal: order.subtotal,
					totalAmount: order.totalAmount,
				},
				newState: {
					items: updateData.items || order.items,
					address: updateData.address || order.address,
					city: updateData.city || order.city,
					postalCode: updateData.postalCode || order.postalCode,
					country: updateData.country || order.country,
					phone: updateData.phone || order.phone,
					notes: updateData.notes || order.notes,
					subtotal: updateData.subtotal || order.subtotal,
					totalAmount: updateData.totalAmount || order.totalAmount,
				},
			});
		} catch (historyError) {
			console.error("Error creating edit history:", historyError);
		}

		// Create a notification for the admin
		try {
			await NotificationModel.create({
				userId: order.user || "system",
				message: `Order #${order._id} was edited by customer`,
				type: "order",
				actionUrl: `/admin/orders/${order._id}`,
				orderId: order._id,
			});
		} catch (notificationError) {
			console.error("Error creating notification:", notificationError);
		}

		// Send email notifications
		try {
			// Send email to customer
			fetch(
				`${process.env.API_URL || "http://localhost:5000"}/api/v1/email/order-edit-email`,
				{
					method: "POST",
					headers: {
						"Content-Type": "application/json",
					},
					body: JSON.stringify({
						orderId: order._id,
						firstName:
							order.firstName || order.user?.name?.split(" ")[0] || "Valued",
						lastName:
							order.lastName ||
							order.user?.name?.split(" ").slice(1).join(" ") ||
							"Customer",
						email: order.email,
						changes,
						items: updateData.items || order.items,
						totalAmount: updateData.totalAmount || order.totalAmount,
						site: order.site || "benzobestellen.com",
					}),
				}
			).catch((err) => console.error("Error sending customer email:", err));

			// Send email to admin
			fetch(
				`${process.env.API_URL || "http://localhost:5000"}/api/v1/email/order-edit-admin-email`,
				{
					method: "POST",
					headers: {
						"Content-Type": "application/json",
					},
					body: JSON.stringify({
						orderId: order._id,
						customerName:
							`${order.firstName || ""} ${order.lastName || ""}`.trim() ||
							order.user?.name ||
							"Customer",
						customerEmail: order.email,
						changes,
						totalAmount: updateData.totalAmount || order.totalAmount,
						adminEmail: process.env.ADMIN_EMAIL || "admin@benzobestellen.com",
						site: order.site || "benzobestellen.com",
					}),
				}
			).catch((err) => console.error("Error sending admin email:", err));
		} catch (emailError) {
			console.error("Error sending notification emails:", emailError);
			// Don't fail the request if emails fail to send
		}

		return res.status(200).json({
			status: true,
			message: "Order updated successfully",
			data: updatedOrder,
			changes,
		});
	} catch (error) {
		console.error("Error updating order:", error);
		return res.status(500).json({
			status: false,
			message: "Server error",
			error: error.message,
		});
	}
};

/**
 * Get order by ID
 */

/**
 * Get order edit history
 */
export const getOrderEditHistory = async (req, res) => {
	try {
		const { orderId } = req.params;

		// Validate the order ID
		if (!mongoose.Types.ObjectId.isValid(orderId)) {
			return res.status(400).json({
				status: false,
				message: "Invalid order ID format",
			});
		}

		// Find the order to check if it exists
		const order = await OrderModel.findById(orderId);

		if (!order) {
			return res.status(404).json({
				status: false,
				message: "Order not found",
			});
		}

		const history = await OrderEditHistoryModel.find({ orderId })
			.sort({ editedAt: -1 })
			.populate("userId", "name email");

		return res.status(200).json({
			status: true,
			data: history,
		});
	} catch (error) {
		console.error("Error fetching order edit history:", error);
		return res.status(500).json({
			status: false,
			message: "Server error",
			error: error.message,
		});
	}
};

/**
 * Check if an order can be edited
 */
export const getOrderEditability = async (req, res) => {
	try {
		const { id } = req.params;

		// Validate the order ID
		if (!mongoose.Types.ObjectId.isValid(id)) {
			return res.status(400).json({
				status: false,
				message: "Invalid order ID format",
			});
		}

		const order = await OrderModel.findById(id);

		if (!order) {
			return res.status(404).json({
				status: false,
				message: "Order not found",
			});
		}

		// Determine what can be edited
		const canEditQuantity =
			order.paymentStatus !== "paid" &&
			(order.orderStatus === "processing" || order.orderStatus === "pending");

		const canEditShipping = !["shipped", "delivered"].includes(
			order.orderStatus
		);

		const canEdit =
			order.orderStatus === "processing" || order.orderStatus === "pending";

		return res.status(200).json({
			status: true,
			data: {
				canEdit,
				canEditQuantity,
				canEditShipping,
			},
		});
	} catch (error) {
		console.error("Error checking order editability:", error);
		return res.status(500).json({
			status: false,
			message: "Server error",
			error: error.message,
		});
	}
};
