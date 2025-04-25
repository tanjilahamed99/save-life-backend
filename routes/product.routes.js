import express from "express";
import {
  createProduct,
  deleteProduct,
  getAllProducts,
  getSingleProduct,
  updateProduct,
} from "../controllers/products.controller.js";

const router = express.Router();

router.get("/all", getAllProducts);
router.get("/:id", getSingleProduct);
router.post("/create", createProduct);
router.put("/update/:id", updateProduct);
router.delete("/delete/:id", deleteProduct);


export const productRoutes = router;
