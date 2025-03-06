import express from "express";
import {
	createOrder,
	getAllOrders,
	getOrderByCustomer,
	getOrderById,
} from "../controllers/order.controller.js";

const router = express.Router();

router.get("/all", getAllOrders);

router.get("/:id", getOrderById);
router.get("/customer/:id", getOrderByCustomer);

router.post("/create", createOrder);

export const orderRoutes = router;
