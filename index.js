import express from "express";
import cors from "cors";
import bodyParser from "body-parser";
import winston from "winston";
import dotenv from "dotenv";
import { connectDB } from "./config/db.js";
import { orderRoutes } from "./routes/order.routes.js";
import { authRoutes } from "./routes/auth.routes.js";
import { userRoutes } from "./routes/user.routes.js";
import { emailRoutes } from "./routes/email.routes.js";
import { paymentRoute } from "./routes/payment.routes.js";
import { productRoutes } from "./routes/product.routes.js";
import { newsletterRoute } from "./routes/newsletter.route.js";
import { ticketRoutes } from "./routes/ticket.routes.js";
import notificationRoutes from "./routes/notification.routes.js";
import walletRoutes from "./routes/wallet.routes.js";
import { discountRoutes } from "./routes/discount.routes.js";

dotenv.config();

const app = express();
const port = process.env.PORT || 4000;

connectDB();

// Middleware
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Cors
app.use(cors());

// app.use(
// 	cors({
// 		origin: [
// 			"https://benzobestellencom.vercel.app",
// 			"https://benzobestellen.com",
// 			"http://localhost:3000",
// 			"https://admin-panel-benzo.vercel.app",
// 			"http://admin.zolpidem-kopen.net/",
// 		],
// 		credentials: true,
// 	})
// );

// Optional: preflight handler for all routes
app.options("*", cors());

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

// email routes
app.use("/api/v1/email", emailRoutes);

// payment
app.use("/api/v1/payment", paymentRoute);

// products
app.use("/api/v1/product", productRoutes);

// newsletter
app.use("/api/v1/newsletter", newsletterRoute);

// tickets
app.use("/api/v1/tickets", ticketRoutes);

// notifications
app.use("/api/v1/notifications", notificationRoutes);

// wallet routes
app.use("/api/v1/wallet", walletRoutes);

app.use("/api/v1/discount", discountRoutes);

// Error handling
app.use((err, req, res, next) => {
  winston.error(err.message);
  res.status(201).send("Something went wrong");
});

// 404 Route
app.use("*", (req, res) => res.send("404 Not Found"));

app.listen(port, () => `Server running on port ${port}`);
