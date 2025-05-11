import express from "express";
import {
	createCustomOrder,
	createOrder,
	customerEditOrder,
	deleteOrder,
	getAllOrders,
	getDiscount,
	getOrderByCustomer,
	getOrderById,
	getOrderEditability,
	getOrderEditHistory,
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

router.put("/customer-edit/:id", customerEditOrder);
// New routes for order editing
router.get("/editability/:id", getOrderEditability);
router.get("/edit-history/:orderId", getOrderEditHistory);

export const orderRoutes = router;
