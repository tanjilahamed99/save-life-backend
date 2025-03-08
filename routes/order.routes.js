import express from "express";
import {
	createOrder,
	getAllOrders,
	getOrderByCustomer,
	getOrderById,
	orderUpdate,
} from "../controllers/order.controller.js";

const router = express.Router();

router.get("/all", getAllOrders);

router.get("/:id", getOrderById);
router.get("/customer/:id", getOrderByCustomer);

router.post("/create", createOrder);

router.put("/:id", orderUpdate);

export const orderRoutes = router;
