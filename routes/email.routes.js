import express from "express";
import { paymentRequest } from "../controllers/email.controller.js";

const router = express.Router();

router.post("/payment/request", paymentRequest);

export const emailRoutes = router;
