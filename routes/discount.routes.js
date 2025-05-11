import express from "express";
import { DiscountModel } from "../models/discount.model.js";
import {
  addDiscount,
  deleteDiscount,
  getAllDiscounts,
  toggleDiscountActive,
} from "../controllers/discount.controller.js";

const router = express.Router();

// get all discount
router.get("/all", getAllDiscounts);

// add new discount
router.post("/add", addDiscount);

// delete discount
router.delete("/delete/:id", deleteDiscount);

router.patch("/toggle/:id", toggleDiscountActive);


export const discountRoutes = router;
