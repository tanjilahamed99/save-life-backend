import express from "express";
import {
	getWalletByEmail,
	createDeposit,
	completeDeposit,
	payOrderFromWallet,
	getTransactionHistory,
	getAllTransactions,
	adjustWalletBalance,
	sendPaymentLink,
} from "../controllers/wallet.controller.js";

const router = express.Router();

// User routes
router.get("/user/:email", getWalletByEmail);
router.post("/deposit", createDeposit);
router.post("/pay-order", payOrderFromWallet);
router.get("/transactions/:email", getTransactionHistory);

// Admin routes
router.get("/transactions", getAllTransactions);
router.post("/adjust-balance", adjustWalletBalance);
router.put("/deposit/:transactionId/complete", completeDeposit);
router.post("/send-payment-link", sendPaymentLink);

export default router;
