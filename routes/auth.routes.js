import express from "express";
import {
	adminLogin,
	adminRegister,
	forgetPassword,
	login,
	register,
	resetPassword,
	verifyOtp,
} from "../controllers/auth.controller.js";

const router = express.Router();

router.post("/login", login);
router.post("/register", register);
router.post("/forget-password", forgetPassword);
router.post("/verify-otp", verifyOtp);
router.post("/password-reset", resetPassword);

// admin routes
router.post("/admin/login", adminLogin);
router.post("/admin/register", adminRegister);

export const authRoutes = router;
