import express from "express";
import {
	marketingCampaign,
	paymentRequest,
} from "../controllers/email.controller.js";

const router = express.Router();

router.post("/payment/request", paymentRequest);
router.post("/campaign/customer", marketingCampaign);

export const emailRoutes = router;
