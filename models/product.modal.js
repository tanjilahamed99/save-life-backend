import mongoose from "mongoose";

const ProductSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Please add a product name"],
      trim: true,
      maxlength: [100, "Name cannot be more than 100 characters"],
    },
    slug: {
      type: String,
      required: [true, "Please add a slug"],
      unique: true,
      trim: true,
      lowercase: true,
    },
    description: {
      type: String,
      required: [true, "Please add a description"],
    },
    shortDescription: {
      type: String,
      maxlength: [200, "Short description cannot be more than 200 characters"],
    },
    price: {
      type: Number,
      required: [true, "Please add a price"],
      min: [0, "Price must be at least 0"],
    },
    originalPrice: {
      type: Number,
      min: [0, "Original price must be at least 0"],
    },
    stock: {
      type: Number,
      required: [true, "Please add stock quantity"],
      min: [0, "Stock cannot be negative"],
    },
    sku: {
      type: String,
      required: [true, "Please add a SKU"],
      // unique: true,
      trim: true,
    },
    category: {
      type: String,
      required: [true, "Please add a category"],
      trim: true,
    },
    categories: {
      type: [String],
      default: [],
    },
    featured: {
      type: Boolean,
      default: false,
    },
    images: {
      type: [String],
      default: ["/placeholder.svg"],
    },
    //     taxClass: {
    //       type: mongoose.Schema.Types.ObjectId,
    //       ref: "TaxClass",
    //       default: null,
    //     },
    //     averageRating: {
    //       type: Number,
    //       min: [0, "Rating must be at least 0"],
    //       max: [5, "Rating cannot be more than 5"],
    //       default: 0,
    //     },
    //     reviewCount: {
    //       type: Number,
    //       default: 0,
    //     },
    //     hasVariants: {
    //       type: Boolean,
    //       default: false,
    //     },
    //     attributes: {
    //       type: Map,
    //       of: [String],
    //       default: {},
    //     },
    //     lowStockThreshold: {
    //       type: Number,
    //       default: 5,
    //     },
    dateAdded: {
      type: Date,
      default: Date.now,
    },
    dateModified: {
      type: Date,
      default: Date.now,
    },
  },
  {
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

// // Create product slug from the name
// ProductSchema.pre("save", function (next) {
//   if (!this.isModified("name")) {
//     next();
//   }

//   this.slug = this.name
//     .toLowerCase()
//     .replace(/[^a-z0-9]+/g, "-")
//     .replace(/(^-|-$)/g, "");

//   this.dateModified = Date.now();

//   next();
// });

// Virtual for product variants
// ProductSchema.virtual("variants", {
//   ref: "ProductVariant",
//   localField: "_id",
//   foreignField: "product",
//   justOne: false,
// });

// Virtual for product reviews
// ProductSchema.virtual("reviews", {
//   ref: "Review",
//   localField: "_id",
//   foreignField: "product",
//   justOne: false,
// });

export const ProductModal = mongoose.model("Product", ProductSchema);
