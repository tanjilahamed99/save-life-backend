import express from "express";
import cors from "cors";
import bodyParser from "body-parser";
import winston from "winston";
import dotenv from "dotenv";
import { connectDB } from "./config/db.js";
import { orderRoutes } from "./routes/order.routes.js";
import { authRoutes } from "./routes/auth.routes.js";
import { userRoutes } from "./routes/user.routes.js";

dotenv.config();

const app = express();
const port = process.env.PORT || 4000;

connectDB();
// Cors
app.use(cors());
// Middleware
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Logger setup
winston.add(
	new winston.transports.Console({
		format: winston.format.simple(),
	})
);

app.get("/", (req, res) => res.send("Medicine Store API"));

// Routes

// auth route
app.use("/api/v1/auth", authRoutes);

// Orders routes
app.use("/api/v1/orders", orderRoutes);

// user routes
app.use("/api/v1/users", userRoutes);

// Error handling
app.use((err, req, res, next) => {
	winston.error(err.message);
	res.status(201).send("Something went wrong");
});

// 404 Route
app.use("*", (req, res) => res.send("404 Not Found"));

app.listen(port, () => `Server running on port ${port}`);
