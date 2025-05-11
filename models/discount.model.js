import mongoose from "mongoose";

const discountSchema = new mongoose.Schema(
  {
    discountCode: { type: String, required: true },
    discountPresentence: { type: Number, required: true },
    expiry: { type: Date },
    active: { type: Boolean, default: true },
  },
  { timestamps: true }
);

export const DiscountModel = mongoose.model("Discount", discountSchema);
