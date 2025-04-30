import Stripe from "stripe";
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

export const createPaymentIntent = async (req, res) => {
  try {
    const { price } = req.body;

    // Validate price input
    if (typeof price !== "number" || price <= 0) {
      return res.status(400).json({ error: "Invalid price amount" });
    }

    const amount = Math.round(price * 100); // Convert to cents and round

    const paymentIntent = await stripe.paymentIntents.create({
      amount,
      currency: "eur", // Required for Bancontact/iDEAL
      payment_method_types: ["card", "bancontact", "ideal"],
      metadata: {
        // Add any relevant metadata
        integration_check: "accept_a_payment",
      },
    });

    res.status(200).json({
      clientSecret: paymentIntent.client_secret,
      paymentIntentId: paymentIntent.id,
    });
  } catch (error) {
    console.error("PaymentIntent error:", error);
    res.status(500).json({
      error: error.message || "Failed to create payment intent",
    });
  }
};
