import { OrderModel } from "../models/order.model.js";
import { EmailHistoryModel } from "../models/email-history.model.js";
import { UserModel } from "../models/user.model.js";
import Email from "../lib/email/email.js";
import { basicEmailTemplate } from "../static/email/basicEmailTemplate.js";
import { newOrderAdminTemplate } from "../static/email/newOrderAdminTemplate.js";
import { newOrderEmailTemplate } from "../static/email/newOrderEmailTemplate.js";
import { generateOtpEmail } from "../static/email/otp.template.js";
import { paymentRequestEmailTemplate } from "../static/email/paymentRequestEmailTemplate.js";
import { updateOrderEmailTemplate } from "../static/email/updateOrderEmailTemplate.js";
import { welcomeEmailTemplate } from "../static/email/welcomeEmailTemplate.js";
import dotenv from "dotenv";

dotenv.config();

// Helper function to save email to history
const saveEmailToHistory = async (
	orderId,
	subject,
	body,
	recipient,
	sender,
	type
) => {
	try {
		await EmailHistoryModel.create({
			order: orderId,
			subject,
			body,
			recipient,
			sender,
			type,
			sentAt: new Date(),
		});
	} catch (error) {
		console.error("Error saving email to history:", error);
	}
};

// Get email history for an order
export const getEmailHistory = async (req, res) => {
	try {
		const { orderId } = req.params;

		const emails = await EmailHistoryModel.find({ order: orderId }).sort({
			sentAt: -1,
		});

		return res.status(200).json({
			status: true,
			message: "Email history retrieved successfully",
			data: emails,
		});
	} catch (error) {
		console.error("Error retrieving email history:", error);
		return res.status(500).json({
			status: false,
			message: "Failed to retrieve email history",
			error: error.message,
		});
	}
};

export const getCustomerEmailHistory = async (req, res) => {
	try {
		const { email } = req.params;

		if (!email) {
			return res.status(400).json({
				status: false,
				message: "Email is required",
			});
		}

		// Find all orders for this customer
		const orders = await OrderModel.find({ email: email });
		const orderIds = orders.map((order) => order._id);

		// Find all emails related to these orders
		const emails = await EmailHistoryModel.find({
			order: { $in: orderIds },
			recipient: email,
		}).sort({ sentAt: -1 });

		return res.status(200).json({
			status: true,
			message: "Email history retrieved successfully",
			data: emails,
		});
	} catch (error) {
		console.error("Error retrieving customer email history:", error);
		return res.status(500).json({
			status: false,
			message: "Failed to retrieve email history",
			error: error.message,
		});
	}
};

export const paymentRequest = async (req, res) => {
	const { orderId, expiry_date, payment_url, date } = req.body;

	// Check if order ID is provided
	if (!orderId) {
		return res
			.status(201)
			.send({ status: false, message: "Order ID is required" });
	}

	// Check if order exists
	const order = await OrderModel.findById({ _id: orderId });

	if (!order) {
		return res.status(201).send({ status: false, message: "Order not found" });
	}

	let sendEmail = [];

	if (order?.sendEmail?.length > 0) {
		sendEmail = [
			{
				expiry_date,
				payment_url,
				date,
			},
			...order.sendEmail,
		];
	} else {
		sendEmail = [
			{
				expiry_date,
				payment_url,
				date,
			},
		];
	}

	const update = {
		$set: {
			sendEmail,
		},
	};

	await OrderModel.findByIdAndUpdate({ _id: orderId }, update);

	const user = await UserModel.findById(order.user);

	if (!user) {
		return res.status(201).send({ status: false, message: "User not found" });
	}

	const site = order.site || "https://benzobestellen.com";
	const subject = "Betalingsverzoek!";

	const htmlContent = await paymentRequestEmailTemplate({
		expiry_date,
		payment_url,
		name: order.firstName + " " + order.lastName,
		order_url:
			site === "https://benzobestellen.com"
				? "https://benzobestellen.com/my-account"
				: "https://zolpidem-kopen.net/my-account",
		orderDate: order.createdAt,
		site,
		order_items: order.items,
		shipping: order?.shipping,
		subtotal: order?.subtotal,
		total: order.totalAmount,
		support_url:
			site === "https://benzobestellen.com"
				? "https://benzobestellen.com/contact"
				: "https://zolpidem-kopen.net/contact",
	});

	try {
		// Send email using Resend
		await new Email(user, site).sendEmailTemplate(htmlContent, subject);

		// Save to email history
		const sender =
			site === "https://zolpidem-kopen.net"
				? "contact@zolpidem-kopen.net"
				: "contact@benzobestellen.com";

		await saveEmailToHistory(
			orderId,
			subject,
			htmlContent,
			order.email,
			sender,
			"payment_request"
		);

		res.send({ success: true, message: "Payment email sent" });
	} catch (err) {
		console.log(err);
		res.status(500).send({ status: false, message: "Failed to send email" });
	}
};

export const marketingCampaign = async (req, res) => {
	const { name, email, site } = req.body;

	if (!email) {
		return res
			.status(201)
			.send({ status: false, message: "Email is required" });
	}

	const subject = `${name}, Exclusieve Korting! 10% Korting op Uw Eerste Bestelling!`;
	const htmlContent = "Marketing campaign content"; // Replace with actual template

	try {
		await new Email({ email }, site).sendEmailTemplate(htmlContent, subject);
		res.send({ status: true, message: "Marketing email sent" });
	} catch (err) {
		console.log(err);
		res.status(500).send({ status: false, message: "Failed to send email" });
	}
};

export const contactUsEmail = async (req, res) => {
	const { name, email, subject, message } = req.body;
	const htmlContent = await basicEmailTemplate({
		message,
		email,
		name,
		subject,
	});

	try {
		await new Email().sendEmailTemplate(htmlContent, subject);
		res.send({ status: true, message: "Email sent" });
	} catch (err) {
		console.log(err);
		res.status(500).send({ status: false, message: "Failed to send email" });
	}
};

export const customerEmail = async (req, res) => {
	const { name, email, subject, message, site, orderId } = req.body;

	const htmlContent = await basicEmailTemplate({
		message,
		email,
		name,
		subject,
	});

	try {
		await new Email({ email }, site).sendEmailTemplate(htmlContent, subject);

		// If this is related to an order, save to email history
		if (orderId) {
			const sender =
				site === "https://zolpidem-kopen.net"
					? "contact@zolpidem-kopen.net"
					: "contact@benzobestellen.com";

			await saveEmailToHistory(
				orderId,
				subject,
				htmlContent,
				email,
				sender,
				"other"
			);
		}

		res.send({ status: true, message: "Email sent" });
	} catch (err) {
		console.log(err);
		res.status(500).send({ status: false, message: "Failed to send email" });
	}
};

export const sendWelcomeEmail = async (req, res) => {
	const user = req.body;
	const htmlContent = await welcomeEmailTemplate({
		name: user.name,
		site: user.site,
	});

	try {
		await new Email(user, user.site).sendEmailTemplate(
			htmlContent,
			`Welkom bij ${user.site}`
		);
		res.send({ status: true, message: "Email sent" });
	} catch (err) {
		console.log(err);
		res.status(500).send({ status: false, message: "Failed to send email" });
	}
};

export const paymentRequestEmail = async (req, res) => {
	const { user, site, orderId } = req.body;

	const subject = "Payment Request";
	const htmlContent = await paymentRequestEmailTemplate({
		site: site,
		name: user.name || "Customer",
		payment_url: "https://example.com/payment",
		order_url: "https://example.com/order",
		support_url: "https://example.com/support",
		order_items: [{ name: "Test Product", quantity: 1, price: 10 }],
		shipping: 5,
		subtotal: 10,
		total: 15,
	});

	try {
		await new Email(user, site).sendEmailTemplate(htmlContent, subject);

		// If this is related to an order, save to email history
		if (orderId) {
			const sender =
				site === "https://zolpidem-kopen.net"
					? "contact@zolpidem-kopen.net"
					: "contact@benzobestellen.com";

			await saveEmailToHistory(
				orderId,
				subject,
				htmlContent,
				user.email,
				sender,
				"payment_request"
			);
		}

		res.send({ status: true, message: "Email sent" });
	} catch (err) {
		console.log(err);
		res.status(500).send({ status: false, message: "Failed to send email" });
	}
};

export const otpEmail = async (req, res) => {
	const { user, site } = req.body;

	const otp = Math.floor(100000 + Math.random() * 900000);

	const htmlContent = await generateOtpEmail({
		name: user.name,
		otp: otp,
		site,
	});

	try {
		await new Email(user, site).sendEmailTemplate(
			htmlContent,
			"Password Reset OTP"
		);
		res.send({ status: true, message: "Email sent" });
	} catch (err) {
		console.log(err);
		res.status(500).send({ status: false, message: "Failed to send email" });
	}
};

export const updateOrderEmail = async (req, res) => {
	const { user, site, orderId, status } = req.body;

	const subject = "Order Status Update";
	const htmlContent = await updateOrderEmailTemplate({
		firstName: user.firstName || user.name?.split(" ")[0] || "",
		lastName: user.lastName || user.name?.split(" ")[1] || "",
		email: user.email,
		status: status || "Processing",
	});

	try {
		await new Email(user, site).sendEmailTemplate(htmlContent, subject);

		// If this is related to an order, save to email history
		if (orderId) {
			const sender =
				site === "https://zolpidem-kopen.net"
					? "contact@zolpidem-kopen.net"
					: "contact@benzobestellen.com";

			await saveEmailToHistory(
				orderId,
				subject,
				htmlContent,
				user.email,
				sender,
				"shipping_update"
			);
		}

		res.send({ status: true, message: "Email sent" });
	} catch (err) {
		console.log(err);
		res.status(500).send({ status: false, message: "Failed to send email" });
	}
};

export const orderPlaceEmail = async (req, res) => {
	const { user, site, orderId, items, totalAmount } = req.body;

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
		const userSubject = "Ja! Uw bestelling is succesvol geplaatst!";
		const adminSubject = "Nieuwe bestelling plaatsen bij Admin";

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

		const sender =
			site === "https://zolpidem-kopen.net"
				? "contact@zolpidem-kopen.net"
				: "contact@benzobestellen.com";

		// Create an array of promises to send emails in parallel
		const emailPromises = [
			new Email(user, site).sendEmailTemplate(htmlContentUser, userSubject),
			new Email("", site).sendEmailTemplate(htmlContentAdmin, adminSubject),
		];

		try {
			// Wait for both emails to be sent
			await Promise.all(emailPromises);

			// Save both emails to history
			if (orderId) {
				await saveEmailToHistory(
					orderId,
					userSubject,
					htmlContentUser,
					email,
					sender,
					"order_confirmation"
				);

				await saveEmailToHistory(
					orderId,
					adminSubject,
					htmlContentAdmin,
					process.env.ADMIN_EMAIL || "admin@example.com",
					email,
					"order_confirmation"
				);
			}
		} catch (err) {
			console.error("Error sending emails:", err);
		}
	};

	// Usage:
	await sendOrderEmail({
		name: user.name,
		email: user.email,
		site,
		orderId,
		adminOrderLink: `${site}/admin/orders/${orderId}`,
		items: items || [],
		orderDate: new Date(),
		support_url: `${site}/contact`,
		totalAmount: totalAmount || 0,
	});

	res.send({ status: true, message: "Email sent" });
};
