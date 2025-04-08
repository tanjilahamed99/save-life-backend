import express from "express";
import {
	deleteUser,
	getCurrentUser,
	getUsers,
	updateProfile,
	updateUserRole,
} from "../controllers/user.controller.js";

const router = express.Router();

router.post("/current", getCurrentUser);
router.post("/all", getUsers);
router.delete("/:id", deleteUser);
router.put("/:id", updateProfile);
router.put("/role/:id", updateUserRole);

export const userRoutes = router;
