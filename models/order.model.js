import mongoose from "mongoose";

const orderSchema = new mongoose.Schema({
  firstName: { type: String, required: false },
  lastName: { type: String, required: false },
  email: { type: String, required: true },
  phone: { type: String, required: true },
  address: { type: String, required: true },
  city: { type: String, required: true },
  postalCode: { type: String, required: true },
  country: { type: String, required: true },
  paymentMethod: { type: String, required: true },
  paymentStatus: { type: String, default: "pending" },
  orderStatus: { type: String, default: "processing" },
  user: {
    _id: { type: mongoose.Schema.Types.ObjectId },
    name: { type: String, required: true },
    email: { type: String, required: true },
    role: { type: String, required: true },
  },
  items: [
    {
      name: { type: String, required: true },
      price: { type: Number, required: true },
      quantity: { type: Number, required: true },
      imageUrl: { type: String },
    },
  ],
  shipping: { type: Number, required: true },
  subtotal: { type: Number, required: true },
  totalAmount: { type: Number, required: true },
  site: { type: String, required: true },
  createdAt: { type: Date, default: Date.now },
  sendEmail: { type: Array },
});

orderSchema.pre("save", function (next) {
  this.updatedAt = new Date();
  next();
});
export const OrderModel = mongoose.model("Order", orderSchema);
