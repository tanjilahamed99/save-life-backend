import { ProductModal } from "../models/product.modal.js";

// create product
export const createProduct = async (req, res) => {
  const product = await ProductModal.create(req.body);
  // Update product count for the category
  //   if (product.category) {
  //     await Category.findOneAndUpdate(
  //       { slug: product.category },
  //       { $inc: { productCount: 1 } }
  //     );
  //   }

  res.status(200).json({
    success: true,
    data: product,
  });
};

export const getAllProducts = async (req, res) => {
  try {
    const products = await ProductModal.find();
    if (!products) {
      res.status(200).json({
        success: false,
        message: "No products found",
      });
    }
    res.status(200).json({
      success: true,
      products,
    });
  } catch (error) {}
};

export const getSingleProduct = async (req, res) => {
  try {
    const product = await ProductModal.findById(req.params.id);

    if (!product) {
      return next(
        new ErrorResponse(`Product not found with id of ${req.params.id}`, 404)
      );
    }

    res.status(200).json({
      success: true,
      product,
    });
  } catch (error) {
    console.log(error);
  }
};

export const updateProduct = async (req, res) => {
  let product = await ProductModal.findById(req.params.id);

  if (!product) {
    return next(
      new ErrorResponse(`Product not found with id of ${req.params.id}`, 404)
    );
  }
  product = await ProductModal.findByIdAndUpdate(
    req.params.id,
    { ...req.body, dateModified: Date.now() },
    {
      new: true,
      runValidators: true,
    }
  );

  res.status(200).json({
    success: true,
    data: product,
  });
};

export const deleteProduct = async (req, res) => {
  try {
    const product = await ProductModal.findById(req.params.id);
    if (!product) {
      return next(
        new ErrorResponse(`Product not found with id of ${req.params.id}`, 404)
      );
    }
    const result = await ProductModal.deleteOne({ _id: req?.params?.id });
    res.status(200).json({
      success: true,
      result,
    });
  } catch (error) {
    console.log(error);
  }
};
