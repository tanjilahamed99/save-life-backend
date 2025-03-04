import mongoose from "mongoose";
import winston from "winston";

export const connectDB = async () => {
	try {
		const conn = await mongoose.connect(process.env.MONGODB_URI);
		console.log(`MongoDB connected: ${conn.connection.host}`);
	} catch (error) {
		winston.error(`Error: ${error.message}`);
		process.exit(1);
	}
};
