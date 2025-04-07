import Email from '../lib/email/emai.js';
import { OrderModel } from '../models/order.model.js';
import { UserModel } from '../models/user.model.js';
import { paymentRequestEmailTemplate } from '../static/email/paymentRequestEmailTemplate.js';
import { welcomeEmailTemplate } from '../static/email/welcomeEmailTemplate.js';

export const paymentRequest = async (req, res) => {
  const {
    orderId,
    pay_amount,
    expiry_date,
    payment_url,
    order_url,
    support_url,
  } = req.body;

  // Check if order ID and message is provided
  if (!orderId) {
    return res
      .status(201)
      .send({ status: false, message: 'Order ID is required' });
  }

  // // Check if order exists
  const order = await OrderModel.findById(orderId);

  if (!order) {
    return res.status(201).send({ status: false, message: 'Order not found' });
  }

  const user = await UserModel.findById(order.user);

  if (!user) {
    return res.status(201).send({ status: false, message: 'User not found' });
  }

  const htmlContent = await paymentRequestEmailTemplate({
    expiry_date,
    pay_amount,
    payment_url,
    name: order.firstName + ' ' + order.lastName,
    order_url,
    orderDate: order.createdAt,
    site: order.site,
    support_url,
    order_items: order.items,
    shipping,
    subtotal,
    total: order.totalAmount,
  });

  try {
    await new Email(user).sendEmailTemplate(
      htmlContent,
      'Payment Request benzobestellen.net'
    );
  } catch (err) {
    console.log(err);
  }

  res.send({ status: true, message: 'Payment email sent' });
};

export const marketingCampaign = async (req, res) => {
  const { name, email } = req.body;

  if (!email) {
    return res
      .status(201)
      .send({ status: false, message: 'Email is required' });
  }

  await sendEmail({
    subject: `${name}, , Exclusieve Korting! 10% Korting op Uw Eerste Bestelling!`,
    template_name: 'marketing_campaign_template',
    email,
    name,
  });

  res.send({
    status: true,
    message: 'Marketing email sent',
  });
};

export const sendWelcomeEmail = async (req, res) => {
  const user = req.body;
  const htmlContent = await welcomeEmailTemplate({
    name: user.name,
    site: user.site,
  });

  try {
    await new Email(user, user.site).sendEmailTemplate(
      htmlContent,
      `Welkom bij ${user.site}`
    );
  } catch (err) {
    console.log(err);
  }

  res.send({ status: true, message: 'Email sent' });
};
