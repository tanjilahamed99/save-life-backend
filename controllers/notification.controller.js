import { NotificationModel } from "../models/notification.model.js";

// Create a new notification
export const createNotification = async (req, res) => {
	try {
		const { userId, message, type, actionUrl, expiryDate, orderId } = req.body;

		if (!userId || !message || !type) {
			return res.status(200).json({
				success: false,
				message: "User ID, message, and type are required",
			});
		}

		// Create the notification
		const notification = await NotificationModel.create({
			userId,
			message,
			type,
			actionUrl,
			expiryDate,
			orderId,
			isRead: false,
			createdAt: new Date(),
		});

		return res.status(201).json({
			success: true,
			data: notification,
			message: "Notification created successfully",
		});
	} catch (error) {
		console.error("Error creating notification:", error);
		return res.status(500).json({
			success: false,
			message: "Failed to create notification",
			error: error.message,
		});
	}
};

// Get notifications for a specific user
export const getUserNotifications = async (req, res) => {
	try {
		const { userId } = req.params;

		if (!userId) {
			return res.status(400).json({
				success: false,
				message: "User ID is required",
			});
		}

		// Find all notifications for this user that are not read or expired
		const currentDate = new Date();
		const notifications = await NotificationModel.find({
			userId,
			$or: [{ expiryDate: { $gt: currentDate } }, { expiryDate: null }],
			isRead: false,
		}).sort({ createdAt: -1 });

		return res.status(200).json({
			success: true,
			data: notifications,
			message: "Notifications retrieved successfully",
		});
	} catch (error) {
		console.error("Error retrieving notifications:", error);
		return res.status(500).json({
			success: false,
			message: "Failed to retrieve notifications",
			error: error.message,
		});
	}
};

// Mark a notification as read
export const markNotificationAsRead = async (req, res) => {
	try {
		const { id } = req.params;

		if (!id) {
			return res.status(400).json({
				success: false,
				message: "Notification ID is required",
			});
		}

		const notification = await NotificationModel.findByIdAndUpdate(
			id,
			{ isRead: true },
			{ new: true }
		);

		if (!notification) {
			return res.status(404).json({
				success: false,
				message: "Notification not found",
			});
		}

		return res.status(200).json({
			success: true,
			data: notification,
			message: "Notification marked as read",
		});
	} catch (error) {
		console.error("Error marking notification as read:", error);
		return res.status(500).json({
			success: false,
			message: "Failed to mark notification as read",
			error: error.message,
		});
	}
};

// Delete a notification
export const deleteNotification = async (req, res) => {
	try {
		const { id } = req.params;

		if (!id) {
			return res.status(400).json({
				success: false,
				message: "Notification ID is required",
			});
		}

		const notification = await NotificationModel.findByIdAndDelete(id);

		if (!notification) {
			return res.status(404).json({
				success: false,
				message: "Notification not found",
			});
		}

		return res.status(200).json({
			success: true,
			message: "Notification deleted successfully",
		});
	} catch (error) {
		console.error("Error deleting notification:", error);
		return res.status(500).json({
			success: false,
			message: "Failed to delete notification",
			error: error.message,
		});
	}
};
