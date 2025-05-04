import mongoose from "mongoose";
import Email from "../lib/email/email.js";
import { WalletsModel } from "../models/wallets.model.js";
import { TransactionModel } from "../models/transaction.model.js";
import { UserModel } from "../models/user.model.js";
import { walletPaymentRequestEmailTemplate } from "../static/email/paymentRequestEmailTemplatea.js";
import { EmailHistoryModel } from "../models/email-history.model.js";
import { OrderModel } from "../models/order.model.js";

const saveEmailToHistory = async (
	transactionId,
	subject,
	body,
	recipient,
	sender,
	type
) => {
	try {
		await EmailHistoryModel.create({
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

// Get wallet by user email
export const getWalletByEmail = async (req, res) => {
	try {
		const { email } = req.params;

		if (!email) {
			return res
				.status(400)
				.json({ status: false, message: "Email is required" });
		}

		let wallet = await WalletsModel.findOne({ email });

		// If wallet doesn't exist, create one
		if (!wallet) {
			const user = await UserModel.findOne({ email });

			if (!user) {
				return res
					.status(404)
					.json({ status: false, message: "User not found" });
			}

			wallet = await WalletsModel.create({
				userId: user._id,
				email: user.email,
				balance: 0,
			});
		}

		return res.status(200).json({ status: true, data: wallet });
	} catch (error) {
		console.error("Error getting wallet:", error);
		return res
			.status(500)
			.json({ status: false, message: "Server error", error: error.message });
	}
};

// Create a deposit transaction
export const createDeposit = async (req, res) => {
	const session = await mongoose.startSession();
	session.startTransaction();

	try {
		const { email, amount, paymentMethod, reference } = req.body;

		if (!email || !amount || !paymentMethod) {
			return res.status(400).json({
				status: false,
				message: "Email, amount, and payment method are required",
			});
		}

		if (amount <= 0) {
			return res
				.status(400)
				.json({ status: false, message: "Amount must be greater than 0" });
		}

		const user = await UserModel.findOne({ email });

		if (!user) {
			return res.status(404).json({ status: false, message: "User not found" });
		}

		let wallet = await WalletsModel.findOne({ email }).session(session);

		if (!wallet) {
			wallet = await WalletsModel.create(
				[
					{
						userId: user._id,
						email: user.email,
						balance: 0,
					},
				],
				{ session }
			);
			wallet = wallet[0];
		}

		// Create a pending transaction
		const transaction = await TransactionModel.create(
			[
				{
					walletId: wallet._id,
					userId: user._id,
					email: user.email,
					type: "deposit",
					amount: amount,
					status: "pending",
					paymentMethod,
					description: `Deposit via ${paymentMethod}`,
					reference: reference || `DEP-${Date.now()}`,
				},
			],
			{ session }
		);

		await session.commitTransaction();
		session.endSession();

		return res.status(201).json({
			status: true,
			message: "Deposit transaction created",
			data: transaction[0],
		});
	} catch (error) {
		await session.abortTransaction();
		session.endSession();
		console.error("Error creating deposit:", error);
		return res
			.status(500)
			.json({ status: false, message: "Server error", error: error.message });
	}
};

// Send payment link for deposit
export const sendPaymentLink = async (req, res) => {
	try {
		const { transactionId, payment_url, expiry_date } = req.body;

		if (!transactionId || !payment_url) {
			return res.status(400).json({
				status: false,
				message: "Transaction ID and payment URL are required",
			});
		}

		const transaction = await TransactionModel.findById(transactionId);

		if (!transaction) {
			return res
				.status(404)
				.json({ status: false, message: "Transaction not found" });
		}

		if (transaction.status !== "pending") {
			return res.status(400).json({
				status: false,
				message: `Transaction is already ${transaction.status}`,
			});
		}

		const user = await UserModel.findById(transaction.userId?._id);

		if (!user) {
			return res.status(404).json({ status: false, message: "User not found" });
		}

		// Update transaction with payment URL
		transaction.paymentUrl = payment_url;
		transaction.expiryDate =
			expiry_date || new Date(Date.now() + 24 * 60 * 60 * 1000); // Default 24 hours
		await transaction.save();

		// Send email with payment link
		const site = "https://benzobestellen.com"; // Or get from user preferences
		const subject = "Betalingsverzoek voor wallet storting";

		const htmlContent = await walletPaymentRequestEmailTemplate({
			expiry_date: transaction.expiryDate,
			payment_url,
			name: user.firstName + " " + user.lastName || user.name,
			order_url: `${site}/dashboard/wallet`,
			orderDate: transaction.createdAt,
			site,
			order_items: [
				{
					name: `Wallet storting (${transaction.paymentMethod})`,
					quantity: 1,
					price: transaction.amount,
				},
			],
			shipping: 0,
			subtotal: transaction.amount,
			total: transaction.amount,
			support_url: `${site}/contact`,
		});

		try {
			await new Email(user, site).sendEmailTemplate(htmlContent, subject);

			// save email history - wallet_payment_request
			await saveEmailToHistory(
				transaction._id,
				subject,
				htmlContent,
				user.email,
				"contact@benzobestellen.com",
				"wallet_payment_request"
			);

			// result
			return res.status(200).json({
				status: true,
				message: "Payment link sent successfully",
			});
		} catch (emailError) {
			console.error("Error sending email:", emailError);
			return res.status(500).json({
				status: false,
				message: "Failed to send payment email",
				error: emailError.message,
			});
		}
	} catch (error) {
		console.error("Error sending payment link:", error);
		return res
			.status(500)
			.json({ status: false, message: "Server error", error: error.message });
	}
};

// Complete a deposit transaction
export const completeDeposit = async (req, res) => {
	const session = await mongoose.startSession();
	session.startTransaction();

	try {
		const { transactionId } = req.params;

		if (!transactionId) {
			return res
				.status(400)
				.json({ status: false, message: "Transaction ID is required" });
		}

		const transaction =
			await TransactionModel.findById(transactionId).session(session);

		if (!transaction) {
			return res
				.status(404)
				.json({ status: false, message: "Transaction not found" });
		}

		if (transaction.status !== "pending") {
			return res.status(400).json({
				status: false,
				message: `Transaction is already ${transaction.status}`,
			});
		}

		const wallet = await WalletsModel.findById(transaction.walletId).session(
			session
		);

		if (!wallet) {
			return res
				.status(404)
				.json({ status: false, message: "Wallet not found" });
		}

		// Update wallet balance
		wallet.balance += transaction.amount;
		await wallet.save({ session });

		// Update transaction status
		transaction.status = "completed";
		await transaction.save({ session });

		await session.commitTransaction();
		session.endSession();

		return res.status(200).json({
			status: true,
			message: "Deposit completed successfully",
			data: { transaction, wallet },
		});
	} catch (error) {
		await session.abortTransaction();
		session.endSession();
		console.error("Error completing deposit:", error);
		return res
			.status(500)
			.json({ status: false, message: "Server error", error: error.message });
	}
};

// Pay for order using wallet balance
export const payOrderFromWallet = async (req, res) => {
	const session = await mongoose.startSession();
	session.startTransaction();

	try {
		const { orderId, email } = req.body;

		if (!orderId || !email) {
			return res
				.status(400)
				.json({ status: false, message: "Order ID and email are required" });
		}

		const order = await OrderModel.findById(orderId).session(session);

		if (!order) {
			return res
				.status(404)
				.json({ status: false, message: "Order not found" });
		}

		if (order.paymentStatus === "paid") {
			return res
				.status(400)
				.json({ status: false, message: "Order is already paid" });
		}

		const wallet = await WalletsModel.findOne({ email }).session(session);

		if (!wallet) {
			return res
				.status(404)
				.json({ status: false, message: "Wallet not found" });
		}

		const orderAmount = order.totalAmount;

		if (wallet.balance < orderAmount) {
			return res.status(400).json({
				status: false,
				message: "Insufficient balance",
				data: {
					balance: wallet.balance,
					required: orderAmount,
					missing: orderAmount - wallet.balance,
				},
			});
		}

		// Create transaction with reference number
		const reference = `ORD-${order._id}`;
		const transaction = await TransactionModel.create(
			[
				{
					walletId: wallet._id,
					userId: wallet.userId,
					email: wallet.email,
					type: "order_payment",
					amount: -orderAmount,
					status: "completed",
					orderId: order._id,
					description: `Payment for order #${order._id}`,
					reference: reference,
				},
			],
			{ session }
		);

		// Update wallet balance
		const previousBalance = wallet.balance;
		wallet.balance -= orderAmount;
		await wallet.save({ session });

		// Update order payment status
		order.paymentStatus = "paid";
		order.paymentMethod = "wallet";
		order.paymentReference = reference;
		order.paymentDate = new Date();
		await order.save({ session });

		await session.commitTransaction();
		session.endSession();

		return res.status(200).json({
			status: true,
			message: "Payment successful",
			data: {
				order,
				wallet,
				transaction: transaction[0],
				reference,
				previousBalance,
				newBalance: wallet.balance,
			},
		});
	} catch (error) {
		await session.abortTransaction();
		session.endSession();
		console.error("Error paying from wallet:", error);
		return res
			.status(500)
			.json({ status: false, message: "Server error", error: error.message });
	}
};

// Get transaction history
export const getTransactionHistory = async (req, res) => {
	try {
		const { email } = req.params;

		if (!email) {
			return res
				.status(400)
				.json({ status: false, message: "Email is required" });
		}

		const transactions = await TransactionModel.find({ email })
			.sort({ createdAt: -1 })
			.populate("orderId", "orderNumber totalAmount");

		return res.status(200).json({ status: true, data: transactions });
	} catch (error) {
		console.error("Error getting transaction history:", error);
		return res
			.status(500)
			.json({ status: false, message: "Server error", error: error.message });
	}
};

// Admin: Get all transactions
export const getAllTransactions = async (req, res) => {
	try {
		const { page = 1, limit = 10, status, type, email } = req.query;

		const query = {};

		if (status) query.status = status;
		if (type) query.type = type;
		if (email) query.email = email;

		const options = {
			page: Number.parseInt(page),
			limit: Number.parseInt(limit),
			sort: { createdAt: -1 },
			populate: [
				{ path: "userId", select: "name email" },
				{ path: "orderId", select: "orderNumber totalAmount" },
			],
		};

		const transactions = await TransactionModel.find(query, null, options);

		return res.status(200).json({ status: true, data: transactions });
	} catch (error) {
		console.error("Error getting all transactions:", error);
		return res
			.status(500)
			.json({ status: false, message: "Server error", error: error.message });
	}
};

// Admin: Manually adjust wallet balance
export const adjustWalletBalance = async (req, res) => {
	const session = await mongoose.startSession();
	session.startTransaction();

	try {
		const { email, amount, description } = req.body;

		if (!email || amount === undefined || !description) {
			return res.status(400).json({
				status: false,
				message: "Email, amount, and description are required",
			});
		}

		const wallet = await WalletsModel.findOne({ email }).session(session);

		if (!wallet) {
			return res
				.status(404)
				.json({ status: false, message: "Wallet not found" });
		}

		// Prevent negative balance
		if (wallet.balance + amount < 0) {
			return res.status(400).json({
				status: false,
				message: "Adjustment would result in negative balance",
			});
		}

		// Create transaction record
		const transactionType = amount > 0 ? "deposit" : "withdrawal";
		await TransactionModel.create(
			[
				{
					walletId: wallet._id,
					userId: wallet.userId,
					email: wallet.email,
					type: transactionType,
					amount: Math.abs(amount),
					status: "completed",
					description: description,
					reference: `ADJ-${Date.now()}`,
				},
			],
			{ session }
		);

		// Update wallet balance
		wallet.balance += amount;
		await wallet.save({ session });

		await session.commitTransaction();
		session.endSession();

		return res.status(200).json({
			status: true,
			message: "Wallet balance adjusted successfully",
			data: wallet,
		});
	} catch (error) {
		await session.abortTransaction();
		session.endSession();
		console.error("Error adjusting wallet balance:", error);
		return res
			.status(500)
			.json({ status: false, message: "Server error", error: error.message });
	}
};
