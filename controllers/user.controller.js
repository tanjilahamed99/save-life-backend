import { UserModel } from "../models/user.model.js";

// Get current user
export const getCurrentUser = async (req, res) => {
	try {
		const user = await UserModel.findById(req.user._id);
		res.status(200).json(user);
	} catch (error) {
		res.status(202).json({ status: false, message: error.message });
	}
};

// Update user role (admin only)
export const updateUserRole = async (req, res) => {
	try {
		const { role } = req.body;
		const user = await UserModel.findById(req.params.id).select("-password");

		if (!user) {
			return res.status(202).json({ status: false, message: "User not found" });
		}

		user.role = role;
		await user.save();

		res.status(200).json({
			_id: user._id,
			name: user.name,
			email: user.email,
			role: user.role,
			phone: user.phone,
			address: user.address,
		});
	} catch (error) {
		res.status(202).json({ status: false, message: error.message });
	}
};

// update user profile
export const updateProfile = async (req, res) => {
	try {
		const { name, email, phone, address } = req.body;
		const user = await UserModel.findById(req.params.id).select("-password");

		if (!user) {
			return res.status(202).json({ status: false, message: "User not found" });
		}

		user.name = name;
		user.email = email;
		user.phone = phone;
		user.address = address;
		await user.save();

		res.status(200).json({
			_id: user._id,
			name: user.name,
			email: user.email,
			role: user.role,
			phone: user.phone,
			address: user.address,
		});
	} catch (error) {
		res.status(202).json({ status: false, message: error.message });
	}
};

// Get all users (admin only)
export const getUsers = async (req, res) => {
	try {
		const users = await UserModel.find({}).select("-password");
		res.status(200).json(users);
	} catch (error) {
		res.status(202).json({ status: false, message: error.message });
	}
};

// Delete user (admin only)
export const deleteUser = async (req, res) => {
	try {
		const user = await UserModel.findById(req.params.id);

		if (!user) {
			return res.status(404).json({ message: "User not found" });
		}

		await UserModel.deleteOne({ _id: user._id });
		res.status(200).json({ message: "User deleted successfully" });
	} catch (error) {
		res.status(500).json({ message: error.message });
	}
};
