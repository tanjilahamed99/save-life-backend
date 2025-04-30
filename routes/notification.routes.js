import express from "express";
import {
	createNotification,
	getUserNotifications,
	markNotificationAsRead,
	deleteNotification,
} from "../controllers/notification.controller.js";

const router = express.Router();

// Create a new notification
router.post("/", createNotification);

// Get notifications for a specific user
router.get("/user/:userId", getUserNotifications);

// Mark a notification as read
router.put("/:id/read", markNotificationAsRead);

// Delete a notification
router.delete("/:id", deleteNotification);

export default router;
