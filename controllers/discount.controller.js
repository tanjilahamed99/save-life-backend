import { DiscountModel } from "../models/discount.model.js";

// GET all discounts
export const getAllDiscounts = async (req, res) => {
  try {
    const discounts = await DiscountModel.find();
    res.status(200).json(discounts);
  } catch (error) {
    res.status(500).json({ message: "Error fetching discounts", error });
  }
};

// POST add new discount
export const addDiscount = async (req, res) => {
  const { discountCode, discountPresentence, expiry } = req.body;

  if (!discountCode || !discountPresentence) {
    return res.status(400).json({ message: "Code and value are required" });
  }

  try {
    const exists = await DiscountModel.findOne({ discountCode });
    if (exists) {
      return res.status(409).json({ message: "Discount code already exists" });
    }

    const discount = new DiscountModel({
      discountCode,
      discountPresentence,
      expiry: expiry || null,
      active: true,
    });

    await discount.save();
    res.status(201).json(discount);
  } catch (error) {
    res.status(500).json({ message: "Error adding discount", error });
  }
};

// DELETE discount by code
export const deleteDiscount = async (req, res) => {
  const { id } = req.params;

  try {
    const deleted = await DiscountModel.findOneAndDelete({ _id: id });
    if (!deleted) {
      return res.status(404).json({ message: "Discount not found" });
    }
    res.status(200).json({ message: "Discount deleted", deleted });
  } catch (error) {
    res.status(500).json({ message: "Error deleting discount", error });
  }
};

export const toggleDiscountActive = async (req, res) => {
  try {
    const { id } = req.params;

    const discount = await DiscountModel.findById({ _id: id });
    if (!discount)
      return res.status(404).json({ message: "Discount not found" });

    discount.active = !discount.active;
    await discount.save();

    res.status(200).json(discount);
  } catch (err) {
    res
      .status(500)
      .json({ message: "Failed to toggle active status", error: err });
  }
};
