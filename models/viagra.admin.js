import mongoose, { Document, Schema } from 'mongoose';

// Admin schema
const viagraAdminSchema = new Schema(
  {
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },
    password: {
      type: String,
      required: true,
      minlength: 6, // You can adjust the minimum length as needed
    },
  },
  { timestamps: true }
);

// Admin model
const viagraAdminModel = mongoose.model('viagraAdmin', viagraAdminSchema);

export default viagraAdminModel;
