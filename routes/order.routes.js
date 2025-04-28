import express from "express";
import {
	createCustomOrder,
	createOrder,
	deleteOrder,
	getAllOrders,
	getDiscount,
	getOrderByCustomer,
	getOrderById,
	orderUpdate,
} from "../controllers/order.controller.js";

const router = express.Router();

router.get("/all", getAllOrders);
router.get("/:id", getOrderById);
router.get("/customer/:email", getOrderByCustomer);
router.post("/create", createOrder);
router.post("/create-custom", createCustomOrder);
router.put("/:id", orderUpdate);
router.delete("/delete/:id", deleteOrder);
router.post("/discount", getDiscount);

export const orderRoutes = router;
