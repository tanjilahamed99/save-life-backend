import express from "express";
import {
	contactUsEmail,
	customerEmail,
	getEmailHistory,
	getCustomerEmailHistory,
	marketingCampaign,
	orderPlaceEmail,
	otpEmail,
	paymentRequest,
	paymentRequestEmail,
	sendWelcomeEmail,
	updateOrderEmail,
} from "../controllers/email.controller.js";

const router = express.Router();

router.post("/payment/request", paymentRequest);
router.post("/campaign/customer", marketingCampaign);
router.post("/contact", contactUsEmail);
router.post("/customer-email", customerEmail);
router.get("/history/:orderId", getEmailHistory);
router.get("/customer-history/:email", getCustomerEmailHistory);

// email test api
router.post("/welcome-email", sendWelcomeEmail);
router.post("/payment-request-email", paymentRequestEmail);
router.post("/order-place-email", orderPlaceEmail);
router.post("/otp-email", otpEmail);
router.post("/update-order-email", updateOrderEmail);

export const emailRoutes = router;
