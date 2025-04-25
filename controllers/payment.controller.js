// Make sure you import Stripe and initialize it properly
import Stripe from "stripe";
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY); // Correct secret key here

export const createPaymentIntent = async (req, res) => {
  try {
    const { price } = req.body;
    const amount = parseInt(price * 100);

    const paymentIntent = await stripe.paymentIntents.create({
      amount,
      currency: "eur",
      payment_method_types: ["card"],
    });

    res.send({
      clientSecret: paymentIntent.client_secret,
    });
  } catch (error) {
    console.error("Error creating PaymentIntent:", error.message);
    res.status(500).send({ error: error.message });
  }
};