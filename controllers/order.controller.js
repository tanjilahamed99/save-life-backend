import { OrderModel } from '../models/order.model.js';
import nodemailer from 'nodemailer';
import { newOrderEmailTemplate } from '../static/email/newOrderEmailTemplate.js';
import Email from '../lib/email/emai.js';
import { newOrderAdminTemplate } from '../static/email/newOrderAdminTemplate.js';

export const getAllOrders = async (req, res) => {
  const orders = await OrderModel.find({}).sort({ createdAt: -1 });
  if (!orders) {
    return res.json({ status: false, message: 'No orders found' });
  }
  res.json({ status: true, data: orders });
};

export const getOrderById = async (req, res) => {
  const order = await OrderModel.findById(req.params.id);
  if (!order) {
    return res.json({ status: false, message: 'Order not found' });
  }
  res.json({ status: true, data: order });
};

export const getOrderByCustomer = async (req, res) => {
  // show desc
  const orders = await OrderModel.find({ email: req.params.id }).sort({
    createdAt: -1,
  });
  if (!orders) {
    return res.json({ status: false, message: 'No orders found' });
  }
  res.json({ status: true, data: orders });
};

export const createOrder = async (req, res) => {
  const {
    user,
    email,
    firstName,
    lastName,
    address,
    city,
    country,
    postalCode,
    phone,
    items,
    site,
  } = req.body;

  // Calculate total amount and verify stock
  let totalAmount = 0;
  for (const item of items) {
    totalAmount += item.price * item.quantity;
  }

  const order = await OrderModel.create({
    firstName,
    lastName,
    phone,
    user,
    email,
    items: items.map((item) => ({
      ...item,
      price: item.price,
    })),
    totalAmount,
    address,
    city,
    postalCode,
    country,
    paymentMethod: 'ideal',
    paymentStatus: 'pending',
    site,
  });

  const sendOrderEmail = async ({
    firstName,
    lastName,
    email,
    address,
    city,
    country,
    postalCode,
    phone,
    site,
    items,
    totalAmount,
  }) => {
    // Prepare the HTML content for the user and admin email templates
    const htmlContentUser = await newOrderEmailTemplate({
      firstName,
      lastName,
      email,
      address,
      city,
      country,
      postalCode,
      phone,
      site,
      items,
      totalAmount,
    });

    const htmlContentAdmin = await newOrderAdminTemplate({
      firstName,
      lastName,
      email,
      address,
      city,
      country,
      postalCode,
      phone,
      items,
      totalAmount,
    });

    // Create an array of promises to send emails in parallel
    const emailPromises = [
      new Email(user).sendEmailTemplate(
        htmlContentUser,
        'New Order Information'
      ),
      new Email().sendEmailTemplate(
        htmlContentAdmin,
        'New Order Place to Admin'
      ),
    ];

    try {
      // Wait for both emails to be sent
      await Promise.all(emailPromises);
      console.log('Emails sent successfully');
    } catch (err) {
      // Detailed error logging
      console.error('Error sending emails:', err);
      // Optional: Send failure notifications or handle retries
    }
  };

  // Usage:
  sendOrderEmail({
    address,
    city,
    country,
    email,
    firstName,
    items,
    lastName,
    phone,
    postalCode,
    site,
    totalAmount,
  });

  res.send({
    status: true,
    data: order,
    message: 'Order created successfully',
  });
};

export const orderUpdate = async (req, res) => {
  const {
    _id,

    status,
    paymentStatus,
  } = req.body;
  // check order exist or not

  const order = await OrderModel.findById({ _id });
  if (!order) {
    return res.send({ status: false, message: 'Order not found' });
  }

  order.status = status;
  order.paymentStatus = paymentStatus;

  const updatedOrder = await order.save();
  res
    .status(200)
    .send({ status: true, data: updatedOrder, message: 'Order updated' });
};
