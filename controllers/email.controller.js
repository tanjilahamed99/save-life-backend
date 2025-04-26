import { sendBrevoCampaign } from "../lib/email/brevoEmail.js";
import Email from "../lib/email/email.js";
import { OrderModel } from "../models/order.model.js";
import { UserModel } from "../models/user.model.js";
import { basicEmailTemplate } from "../static/email/basicEmailTemplate.js";
import { newOrderAdminTemplate } from "../static/email/newOrderAdminTemplate.js";
import { newOrderEmailTemplate } from "../static/email/newOrderEmailTemplate.js";
import { generateOtpEmail } from "../static/email/otp.template.js";
import { paymentRequestEmailTemplate } from "../static/email/paymentRequestEmailTemplate.js";
import { updateOrderEmailTemplate } from "../static/email/updateOrderEmailTemplate.js";
import { welcomeEmailTemplate } from "../static/email/welcomeEmailTemplate.js";

export const paymentRequest = async (req, res) => {
  const { orderId, expiry_date, payment_url, date } = req.body;

  // Check if order ID and message is provided
  if (!orderId) {
    return res
      .status(201)
      .send({ status: false, message: "Order ID is required" });
  }

  // Check if order exists
  const order = await OrderModel.findById({ _id: orderId });

  if (!order) {
    return res.status(201).send({ status: false, message: "Order not found" });
  }

  let sendEmail = [];

  if (order?.sendEmail.length > 0) {
    sendEmail = [
      {
        expiry_date,
        payment_url,
        date,
      },
      ...order.sendEmail,
    ];
  } else {
    sendEmail = [
      {
        expiry_date,
        payment_url,
        date,
      },
    ];
  }

  const update = {
    $set: {
      sendEmail,
    },
  };

  await OrderModel.findByIdAndUpdate({ _id: orderId }, update);

  const user = await UserModel.findById(order.user);

  if (!user) {
    return res.status(201).send({ status: false, message: "User not found" });
  }
  const htmlContent = await paymentRequestEmailTemplate({
    expiry_date,
    payment_url,
    name: order.firstName + " " + order.lastName,
    order_url:
      order.site === "https://benzobestellen.com"
        ? "https://benzobestellen.com/my-account"
        : "https://zolpidem-kopen.net/my-account",
    orderDate: order.createdAt,
    site: order.site,
    order_items: order.items,
    shipping: order?.shipping,
    subtotal: order?.subtotal,
    total: order.totalAmount,
    support_url:
      order.site === "https://benzobestellen.com"
        ? "https://benzobestellen.com/contact"
        : "https://zolpidem-kopen.net/contact",
  });

  try {
    // await new Email(user, order.site).sendEmailTemplate(
    //   htmlContent,
    //   'Betalingsverzoek!'
    // );
    await sendBrevoCampaign({
      subject: "Je Bestellingstatus is Bijgewerkt door het Benzobestellen Team",
      senderName: "Benzobestellen",
      senderEmail: process.env.BREVO_EMAIL,
      htmlContent: htmlContent,
      to: order?.email,
    });
  } catch (err) {
    console.log(err);
  }

  res.send({ success: true, message: "Payment email sent" });
};

export const marketingCampaign = async (req, res) => {
  const { name, email } = req.body;

  if (!email) {
    return res
      .status(201)
      .send({ status: false, message: "Email is required" });
  }

  await sendEmail({
    subject: `${name}, , Exclusieve Korting! 10% Korting op Uw Eerste Bestelling!`,
    template_name: "marketing_campaign_template",
    email,
    name,
  });

  res.send({
    status: true,
    message: "Marketing email sent",
  });
};

export const contactUsEmail = async (req, res) => {
  const { name, email, subject, message } = req.body;
  const htmlContent = await basicEmailTemplate({
    message,
    email,
    name,
    subject,
  });

  try {
    // await new Email().sendEmailTemplate(htmlContent, subject);

    await sendBrevoCampaign({
      subject: subject,
      senderName: "Benzobestellen",
      senderEmail: process.env.BREVO_EMAIL,
      htmlContent: htmlContent,
      to: email,
    });
  } catch (err) {
    console.log(err);
  }

  res.send({ status: true, message: "Email sent" });
};
export const customerEmail = async (req, res) => {
  const { name, email, subject, message, site } = req.body;

  const htmlContent = await basicEmailTemplate({
    message,
    email,
    name,
    subject,
  });

  try {
    // await new Email(req.body, site).sendEmailTemplate(htmlContent, subject);
    await sendBrevoCampaign({
      subject: subject,
      senderName: "Benzobestellen",
      senderEmail: process.env.BREVO_EMAIL,
      htmlContent: htmlContent,
      to: email,
    });
  } catch (err) {
    console.log(err);
  }

  res.send({ status: true, message: "Email sent" });
};
//  email test
export const sendWelcomeEmail = async (req, res) => {
  const user = req.body;
  const htmlContent = await welcomeEmailTemplate({
    name: user.name,
    site: user.site,
  });

  try {
    // await new Email(user, user.site).sendEmailTemplate(
    //   htmlContent,
    //   `Welkom bij ${user.site}`
    // );
    await sendBrevoCampaign({
      subject: `Welkom bij ${user.site}`,
      senderName: "Benzobestellen",
      senderEmail: process.env.BREVO_EMAIL,
      htmlContent: htmlContent,
      to: user?.email,
    });
  } catch (err) {
    console.log(err);
  }

  res.send({ status: true, message: "Email sent" });
};

export const paymentRequestEmail = async (req, res) => {
  const { user, site } = req.body;

  const htmlContent = await paymentRequestEmailTemplate({
    // expiry_date,
    // pay_amount,
    // payment_url,
    // name: order.firstName + ' ' + order.lastName,
    // order_url,
    // orderDate: order.createdAt,
    site: site,
    // support_url,
    // order_items: order.items,
    // shipping,
    // subtotal,
    // total: order.totalAmount,
  });

  try {
    // await new Email(user, site).sendEmailTemplate(
    //   htmlContent,
    //   "Payment Request"
    // );
    await sendBrevoCampaign({
      subject: `Payment Request`,
      senderName: "Benzobestellen",
      senderEmail: process.env.BREVO_EMAIL,
      htmlContent: htmlContent,
      to: user?.email,
    });
  } catch (err) {
    console.log(err);
  }

  res.send({ status: true, message: "Email sent" });
};

export const otpEmail = async (req, res) => {
  const { user, site } = req.body;

  const otp = Math.floor(100000 + Math.random() * 900000);

  const htmlContent = await generateOtpEmail({
    name: user.name,
    otp: otp,
    site,
  });

  try {
    // await new Email(user, site).sendEmailTemplate(
    //   htmlContent,
    //   "Password Reset OTP"
    // );
    await sendBrevoCampaign({
      subject: "Password Reset OTP",
      senderName: "Benzobestellen",
      senderEmail: process.env.BREVO_EMAIL,
      htmlContent: htmlContent,
      to: user?.email,
    });
  } catch (err) {
    console.log(err);
  }

  res.send({ status: true, message: "Email sent" });
};

export const updateOrderEmail = async (req, res) => {
  const { user, site } = req.body;
  const htmlContent = await updateOrderEmailTemplate({
    name: user.name,
    site: site,
    status: "Processing",
  });

  try {
    // await new Email(user, site).sendEmailTemplate(
    //   htmlContent,
    //   `Welkom bij ${site}`
    // );
    await sendBrevoCampaign({
      subject: `Welkom bij ${site}`,
      senderName: "Benzobestellen",
      senderEmail: process.env.BREVO_EMAIL,
      htmlContent: htmlContent,
      to: user?.email,
    });
  } catch (err) {
    console.log(err);
  }

  res.send({ status: true, message: "Email sent" });
};

export const orderPlaceEmail = async (req, res) => {
  const { user, site } = req.body;
  const { email } = user;
  const sendOrderEmail = async ({
    firstName,
    lastName,
    email,
    site,
    orderId,
    adminOrderLink,
    items,
    orderDate,
    totalAmount,
    support_url,
  }) => {
    // Prepare the HTML content for the user and admin email templates
    const htmlContentUser = await newOrderEmailTemplate({
      firstName,
      lastName,
      site,
      support_url,
    });

    const htmlContentAdmin = await newOrderAdminTemplate({
      firstName,
      lastName,
      email,
      items,
      site,
      totalAmount,
      orderId,
      adminOrderLink,
      orderDate,
    });

    // Create an array of promises to send emails in parallel
    const emailPromises = [
      // new Email(user, site).sendEmailTemplate(htmlContentUser, ""),
      sendBrevoCampaign({
        subject: "Nieuwe Bestelinformatie",
        senderName: "Benzobestellen",
        senderEmail: process.env.BREVO_EMAIL,
        htmlContent: htmlContent,
        to: user?.email,
      }),
      sendBrevoCampaign({
        subject: "Nieuwe Bestelling Ontvangen door Admin",
        senderName: "Benzobestellen",
        senderEmail: process.env.BREVO_EMAIL,
        htmlContent: htmlContent,
        to: user?.email,
      }),
      // new Email(user, site).sendEmailTemplate(
      //   htmlContentAdmin,

      // ),
    ];

    try {
      // Wait for both emails to be sent
      await Promise.all(emailPromises);
      console.log("Emails sent successfully");
    } catch (err) {
      // Detailed error logging
      console.error("Error sending emails:", err);
      // Optional: Send failure notifications or handle retries
    }
  };

  // Usage:
  sendOrderEmail({
    // email,
    // firstName,
    // items,
    // lastName,
    // site,
    // totalAmount,
    // orderId: order._id,
    // adminOrderLink,
    // orderDate: order.createdAt,
  });

  res.send({ status: true, message: "Email sent" });
};
