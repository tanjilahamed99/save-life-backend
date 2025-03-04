import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { UserModel } from "../models/user.model.js";

// Register user
export const register = async (req, res) => {
	try {
		const { name, email, password } = req.body;

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
