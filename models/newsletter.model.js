import mongoose from "mongoose";

const newsletterSchema = new mongoose.Schema({
  email: { type: String, required: true },
  date: { type: String, required: true },
  createdAt: { type: Date, default: Date.now },
});

export const NewsletterModel = mongoose.model("newsletter", newsletterSchema);
