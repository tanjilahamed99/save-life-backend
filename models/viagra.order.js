import mongoose from 'mongoose';

const viagraOrderSchema = new mongoose.Schema(
  {
    firstName: { type: String, required: false },
    lastName: { type: String, required: false },
    email: { type: String, required: true },
    phone: { type: String, required: true },
    address: { type: String, required: true },
    city: { type: String, required: true },
    postalCode: { type: String, required: true },
    country: { type: String, required: true },
    paymentMethod: { type: String, required: true },
    paymentStatus: { type: String, default: 'pending' },
    orderStatus: { type: String, default: 'pending' },
    user: {
      name: { type: String, required: true },
      email: { type: String, required: true },
      role: { type: String, required: true },
    },
    items: [
      {
        name: { type: String, required: true },
        price: { type: Number, required: true },
        quantity: { type: Number, required: true },
        image: { type: String, required: true },
      },
    ],
    totalAmount: { type: Number, required: true },
    site: { type: String, required: true },
  },
  { timestamps: true }
);

// viagraOrderSchema.pre('save', function (next) {
//   this.updatedAt = new Date();
//   next();
// });
export const viagraOrderModel = mongoose.model(
  'viagraOrder',
  viagraOrderSchema
);
