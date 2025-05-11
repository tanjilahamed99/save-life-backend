import jwt from "jsonwebtoken";
import UserModel from "../models/user.model.js";

/**
 * Protect routes - Authentication middleware
 */
export const protect = async (req, res, next) => {
	let token;

	// Check if token exists in the Authorization header
	if (
		req.headers.authorization &&
		req.headers.authorization.startsWith("Bearer")
	) {
		try {
			// Get token from header
			token = req.headers.authorization.split(" ")[1];

			// Verify token
			const decoded = jwt.verify(token, process.env.JWT_SECRET);

			// Get user from the token
			req.user = await UserModel.findById(decoded.id || decoded._id).select(
				"-password"
			);

			next();
		} catch (error) {
			console.error("Auth middleware error:", error);
			res
				.status(401)
				.json({ status: false, message: "Not authorized, token failed" });
		}
	} else if (req.cookies && req.cookies.token) {
		// Alternative: check if token exists in cookies
		try {
			token = req.cookies.token;

			// Verify token
			const decoded = jwt.verify(token, process.env.JWT_SECRET);

			// Get user from the token
			req.user = await UserModel.findById(decoded.id || decoded._id).select(
				"-password"
			);

			next();
		} catch (error) {
			console.error("Auth middleware error:", error);
			res
				.status(401)
				.json({ status: false, message: "Not authorized, token failed" });
		}
	}

	if (!token) {
		res
			.status(401)
			.json({ status: false, message: "Not authorized, no token" });
	}
};

/**
 * Admin middleware - Check if user is an admin
 */
export const admin = (req, res, next) => {
	if (req.user && req.user.role === "admin") {
		next();
	} else {
		res.status(401).json({ status: false, message: "Not authorized as admin" });
	}
};
