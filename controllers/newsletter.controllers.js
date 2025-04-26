import { NewsletterModel } from "../models/newsletter.model.js";

export const createNewsletter = async (req, res) => {
  try {
    const { email, date } = req.body;
    if (!email || !date) {
      return res.send({
        success: false,
        message: "request body invalid",
      });
    }

    const isExist = await NewsletterModel.findOne({ email });

    if (isExist) {
      return res.send({
        success: false,
        message: "This email already exist",
      });
    }

    const result = await NewsletterModel.create(req.body);
    return res.send({
      success: true,
      result,
    });
  } catch (error) {
    console.log(error);
  }
};
