import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { UserModel } from "../models/user.model.js";
import { AdminModel } from "../models/admin.model.js";
import Email from "../lib/email/email.js";
import { generateOtpEmail } from "../static/email/otp.template.js";
import { welcomeEmailTemplate } from "../static/email/welcomeEmailTemplate.js";
import { sendBrevoCampaign } from "../lib/email/brevoEmail.js";
import { passwordChangeEmailTemplate } from "../static/email/passwordChangeEmailTemplate.js";
import { WalletsModel } from "../models/wallets.model.js";
import { TransactionModel } from "../models/transaction.model.js";

// admin login
export const adminLogin = async (req, res) => {
	try {
		const { email, password } = req.body;

		// Check for user email
		const user = await AdminModel.findOne({ email });

		if (user && (await bcrypt.compare(password, user.password))) {
			res.status(200).json({
				status: true,
				user: {
					_id: user._id,
					name: user.name,
					email: user.email,
					token: generateToken(user?._id),
				},
			});
		} else {
			res
				.status(202)
				.json({ status: false, message: "Invalid email or password" });
		}
	} catch (error) {
		res.status(202).json({ status: false, message: error.message });
	}
};

export const adminRegister = async (req, res) => {
	try {
		const { name, email, password } = req.body;

		// Check if user exists
		const userExists = await AdminModel.findOne({ email });
		if (userExists) {
			return res
				.status(202)
				.json({ status: false, message: "User already exists" });
		}

		// Hash password
		const salt = await bcrypt.genSalt(10);
		const hashedPassword = await bcrypt.hash(password, salt);

		// Create user
		const user = await AdminModel.create({
			name,
			email,
			password: hashedPassword,
		});

		if (user) {
			res.status(201).json({
				status: true,
				user: {
					_id: user._id,
					name: user.name,
					email: user.email,
					token: generateToken(user._id),
				},
			});
		}
	} catch (error) {
		res.status(201).json({ status: false, message: error.message });
	}
};

// Register user
export const register = async (req, res) => {
	try {
		const { name, email, password, site } = req.body;

		// Check if user exists
		const userExists = await UserModel.findOne({ email });
		if (userExists) {
			return res
				.status(202)
				.json({ status: false, message: "User already exists" });
		}

		// Hash password
		const salt = await bcrypt.genSalt(10);
		const hashedPassword = await bcrypt.hash(password, salt);

		// Create user
		const user = await UserModel.create({
			name,
			email,
			password: hashedPassword,
		});

		if (user) {
			const htmlContent = await welcomeEmailTemplate({
				name,
				site,
			});

			try {
				await new Email(user, site).sendEmailTemplate(
					htmlContent,
					`Welkom bij ${site}`
				);
				// Create wallet for the new user with 5 euro bonus
				const wallet = await WalletsModel.create([
					{
						userId: user._id,
						email: user.email,
						balance: 5, // 5 euro bonus
					},
				]);

				// Create a transaction record for the bonus
				await TransactionModel.create([
					{
						walletId: wallet[0]._id,
						userId: user._id,
						email: user.email,
						type: "deposit",
						amount: 5,
						status: "completed",
						description: "Welkomstbonus voor nieuwe registratie",
						reference: `WELCOME-${Date.now()}`,
					},
				]);

				// await sendBrevoCampaign({
				//   subject: "Welkom bij Benzobestellen!",
				//   senderName: "Benzobestellen",
				//   senderEmail: process.env.BREVO_EMAIL,
				//   htmlContent: htmlContent,
				//   to: email,
				// });
			} catch (err) {
				console.log(err);
			}

			res.status(201).json({
				status: true,
				user: {
					_id: user._id,
					name: user.name,
					email: user.email,
					role: user.role,
					token: generateToken(user._id),
				},
			});
		}
	} catch (error) {
		res.status(201).json({ status: false, message: error.message });
	}
};

// Login user
export const login = async (req, res) => {
	try {
		const { email, password } = req.body;

		// Check for user email
		const user = await UserModel.findOne({ email });

		if (user && (await bcrypt.compare(password, user.password))) {
			res.status(200).json({
				status: true,
				user: {
					_id: user._id,
					name: user.name,
					email: user.email,
					role: user.role,
					token: generateToken(user),
				},
			});
		} else {
			res
				.status(202)
				.json({ status: false, message: "Invalid email or password" });
		}
	} catch (error) {
		res.status(202).json({ status: false, message: error.message });
	}
};

// forget password
export const forgetPassword = async (req, res) => {
	try {
		const { email, site } = req.body;
		// Check for user email
		const user = await UserModel.findOne({ email });

		if (!user) {
			return res.status(202).json({ status: false, message: "User not found" });
		}
		if (user) {
			// 	// Generate OTP
			const otp = Math.floor(100000 + Math.random() * 900000);

			const htmlContent = await generateOtpEmail({ name: user.name, otp: otp });

			try {
				await new Email(user, site).sendEmailTemplate(
					htmlContent,
					"Wachtwoord resetten OTP"
				);
				// await sendBrevoCampaign({
				//   subject: "Je verificatiecode van Benzobestellen",
				//   senderName: "Benzobestellen",
				//   senderEmail: process.env.BREVO_EMAIL,
				//   htmlContent: htmlContent,
				//   to: email,
				// });
			} catch (err) {
				console.log(err);
			}

			// save otp to database
			await UserModel.updateOne({ email }, { $set: { otp } });
			res.status(200).json({ status: true, message: "OTP sent successfully" });
		}
	} catch (error) {
		res.status(202).json({ status: false, message: error.message });
	}
};

// verify otp
export const verifyOtp = async (req, res) => {
	try {
		const { email, otp } = req.body;
		// Check for user email
		const user = await UserModel.findOne({ email });

		if (!user) {
			return res.status(202).json({ status: false, message: "Invalid OTP" });
		}
		if (user) {
			if (user.otp == otp) {
				res
					.status(200)
					.json({ status: true, message: "OTP verified successfully" });
			} else {
				res.status(202).json({ status: false, message: "Invalid OTP" });
			}
		}
	} catch (error) {
		res.status(202).json({ status: false, message: error.message });
	}
};

// reset password
export const resetPassword = async (req, res) => {
	const { otp, email, password } = req.body;
	// Check for user email
	const user = await UserModel.findOne({ email, otp });
	if (!user) {
		return res.status(202).json({ status: false, message: "User not found" });
	}
	if (user) {
		// Hash password
		const salt = await bcrypt.genSalt(10);
		const hashedPassword = await bcrypt.hash(password, salt);
		// remove otp from database and update password

		await UserModel.updateOne(
			{ email },
			{ $set: { password: hashedPassword }, $unset: { otp: "" } }
		);

		const htmlContent = await passwordChangeEmailTemplate({
			name: user.name,
		});

		await sendBrevoCampaign({
			subject: "Je wachtwoord is succesvol gewijzigd",
			senderName: "Benzobestellen",
			senderEmail: process.env.BREVO_EMAIL,
			htmlContent: htmlContent,
			to: email,
		});

		res
			.status(200)
			.json({ status: true, message: "Password reset successfully" });
	}
};

// Generate JWT
const generateToken = (user) => {
	const payload = {
		_id: user._id,
		name: user.name,
		email: user.email,
		role: user.role,
	};
	return jwt.sign({ payload }, process.env.JWT_SECRET, {
		expiresIn: "30d",
	});
};
