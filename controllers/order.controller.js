import { OrderModel } from "../models/order.model.js";
import { newOrderEmailTemplate } from "../static/email/newOrderEmailTemplate.js";
import { newOrderAdminTemplate } from "../static/email/newOrderAdminTemplate.js";
import { viagraOrderModel } from "../models/viagra.order.js";
import { updateOrderEmailTemplate } from "../static/email/updateOrderEmailTemplate.js";
import { AdminModel } from "../models/admin.model.js";
import viagraAdminModel from "../models/viagra.admin.js";
import { UserModel } from "../models/user.model.js";
import Email from "../lib/email/email.js";
import bcrypt from "bcryptjs";

export const getAllOrders = async (req, res) => {
  console.log("getAllOrders");
  const orders = await OrderModel.find({}).sort({ createdAt: -1 });

  res.json({ status: true, data: orders });
};

export const getOrderById = async (req, res) => {
  console.log(req.params.id);

  // const order = await OrderModel.findById(req.params.id);
  const order = await OrderModel.findById({ _id: req.params.id });
  if (!order) {
    return res.json({ status: false, message: "Order not found" });
  }
  res.json({ status: true, data: order });
};

export const getOrderByCustomer = async (req, res) => {
  // show desc
  const orders = await OrderModel.find({ email: req.params.id }).sort({
    createdAt: -1,
  });
  if (!orders) {
    return res.json({ status: false, message: "No orders found" });
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
    paymentStatus,
    paymentMethod,
  } = req.body;

  // Calculate total amount and verify stock
  let subtotal = 0;
  for (const item of items) {
    subtotal += item.price * item.quantity;
  }
  const fullName = firstName + " " + lastName;
  const userData = await UserModel.findOne({ email: user.email });

  const shipping = 5;

  const totalAmount = subtotal + shipping;

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
    shipping,
    subtotal,
    paymentMethod,
    paymentStatus,
    site,
  });

  // const admins = await AdminModel.find({});

  const sendOrderEmail = async ({
    name,
    email,
    site,
    orderId,
    adminOrderLink,
    items,
    orderDate,
    support_url,
    totalAmount,
  }) => {
    // Prepare the HTML content for the user and admin email templates
    const htmlContentUser = await newOrderEmailTemplate({
      name,
      site,
      support_url,
      orderId,
    });

    const htmlContentAdmin = await newOrderAdminTemplate({
      name,
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
      new Email(user, site).sendEmailTemplate(
        htmlContentUser,
        "Ja! Uw bestelling is succesvol geplaatst!"
      ),

      new Email("", site).sendEmailTemplate(
        htmlContentAdmin,
        "Nieuwe bestelling plaatsen bij Admin"
      ),

      // ...admins
      //   .filter((admin) => admin.email !== 'admin@gmail.com')
      //   .map((admin) =>
      //     new Email(admin, site).sendEmailTemplate(
      //       htmlContentAdmin,
      //       'New Order Place to Admin'
      //     )
      //   ),
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
    name: userData.name || fullName,
    email,
    items,
    site,
    totalAmount,
    orderId: order._id,
    adminOrderLink: "https://benzobestellen.com/admin",
    orderDate: order.createdAt,
    support_url:
      site === "https://benzobestellen.com"
        ? "https://benzobestellen.com/contact"
        : "https://zolpidem-kopen.net/contact",
  });

  res.send({
    status: true,
    data: order,
    message: "Order created successfully",
  });
};
export const createCustomOrder = async (req, res) => {
  const {
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
    paymentStatus,
    paymentMethod,
  } = req.body;

  // Calculate total amount and verify stock
  let subtotal = 0;
  for (const item of items) {
    subtotal += item.price * item.quantity;
  }
  const fullName = firstName + " " + lastName;
  const userData = await UserModel.findOne({ email: email });

  let user;

  if (!userData) {
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash("1234", salt);

    // Create user
    user = await UserModel.create({
      name: fullName,
      email,
      password: hashedPassword,
    });
  }

  const shipping = 5;

  const totalAmount = subtotal + shipping;

  const order = await OrderModel.create({
    firstName,
    lastName,
    phone,
    user: userData || user,
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
    shipping,
    subtotal,
    paymentMethod,
    paymentStatus,
    site,
  });

  // const admins = await AdminModel.find({});

  const sendOrderEmail = async ({
    name,
    email,
    site,
    orderId,
    adminOrderLink,
    items,
    orderDate,
    support_url,
    totalAmount,
  }) => {
    // Prepare the HTML content for the user and admin email templates
    const htmlContentUser = await newOrderEmailTemplate({
      name,
      site,
      support_url,
      orderId,
    });

    const htmlContentAdmin = await newOrderAdminTemplate({
      name,
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
      new Email(userData || user, site).sendEmailTemplate(
        htmlContentUser,
        "Ja! Uw bestelling is succesvol geplaatst!"
      ),

      new Email("", site).sendEmailTemplate(
        htmlContentAdmin,
        "Nieuwe bestelling plaatsen bij Admin"
      ),

      // ...admins
      //   .filter((admin) => admin.email !== 'admin@gmail.com')
      //   .map((admin) =>
      //     new Email(admin, site).sendEmailTemplate(
      //       htmlContentAdmin,
      //       'New Order Place to Admin'
      //     )
      //   ),
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
    name: fullName,
    email,
    items,
    site,
    totalAmount,
    orderId: order._id,
    adminOrderLink: "https://benzobestellen.com/admin",
    orderDate: order.createdAt,
    support_url:
      site === "https://benzobestellen.com"
        ? "https://benzobestellen.com/contact"
        : "https://zolpidem-kopen.net/contact",
  });

  res.send({
    status: true,
    data: order,
    message: "Order created successfully",
  });
};

export const orderUpdate = async (req, res) => {
  const { orderStatus, paymentStatus, site } = req.body;
  const { id } = req.params;

  const order = await OrderModel.findById({ _id: id });

  if (!order) {
    return res.send({ status: false, message: "Order not found" });
  }

  order.orderStatus = orderStatus;
  order.paymentStatus = paymentStatus;
  const { firstName, lastName, email, items, totalAmount } = order;

  const htmlContentUser = await updateOrderEmailTemplate({
    firstName,
    lastName,
    email,
    orderId: order._id,
    status: orderStatus,
    items,
    totalAmount,
  });
  const user = {
    email,
  };
  try {
    await new Email(user, site).sendEmailTemplate(
      htmlContentUser,
      "Werk de bestelstatus bij"
    );
  } catch (err) {
    console.log(err);
  }

  const updatedOrder = await order.save();
  res
    .status(200)
    .send({ status: true, data: updatedOrder, message: "Order updated" });
};

// viagra
export const createViagraOrder = async (req, res) => {
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
    support_url,
  } = req.body;

  // Calculate total amount and verify stock
  let totalAmount = 0;
  for (const item of items) {
    totalAmount += item.price * item.quantity;
  }

  const order = await viagraOrderModel.create({
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
    paymentMethod: "ideal",
    paymentStatus: "pending",
    site,
  });
  const admins = await viagraAdminModel.find({});

  const sendOrderEmail = async ({
    name,
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
      name,
      site,
      support_url,
    });

    const htmlContentAdmin = await newOrderAdminTemplate({
      name,
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
      new Email(user, site).sendEmailTemplate(
        htmlContentUser,
        "Ja! Uw bestelling is succesvol geplaatst!"
      ),
      ...admins
        .filter((admin) => admin.email !== "admin@gmail.com")
        .map((admin) =>
          new Email(admin, site).sendEmailTemplate(
            htmlContentAdmin,
            "Nieuwe bestelling plaatsen bij Admin"
          )
        ),
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
    name,
    email,
    items,
    site,
    totalAmount,
    orderId: order._id,
    adminOrderLink,
    orderDate: order.createdAt,
    support_url,
  });

  res.send({
    status: true,
    data: order,
    message: "Order created successfully",
  });
};
export const getAllViagraOrders = async (req, res) => {
  const orders = await viagraOrderModel.find({}).sort({ createdAt: -1 });
  if (!orders || orders.length === 0) {
    return res.json({ status: false, message: "No Viagra orders found" });
  }
  res.json({ status: true, data: orders });
};
export const getViagraOrderById = async (req, res) => {
  const order = await viagraOrderModel.findById(req.params.id);
  if (!order) {
    return res.json({ status: false, message: "Viagra order not found" });
  }
  res.json({ status: true, data: order });
};
export const getViagraOrderByCustomer = async (req, res) => {
  const orders = await viagraOrderModel.find({ email: req.params.id }).sort({
    createdAt: -1,
  });
  if (!orders || orders.length === 0) {
    return res.json({
      status: false,
      message: "No Viagra orders found for this customer",
    });
  }
  res.json({ status: true, data: orders });
};
export const updateViagraOrder = async (req, res) => {
  const { id } = req.params;
  const { orderStatus, paymentStatus, site } = req.body;

  // check if the order exists
  const order = await viagraOrderModel.findById(id);
  if (!order) {
    return res.send({ status: false, message: "Viagra order not found" });
  }

  order.orderStatus = orderStatus;
  order.paymentStatus = paymentStatus;
  const { firstName, lastName, email, items, totalAmount } = order;
  const updatedOrder = await order.save();

  const htmlContentUser = await updateOrderEmailTemplate({
    firstName,
    lastName,
    email,
    orderId: order._id,
    status: orderStatus,
    items,
    totalAmount,
  });
  const user = {
    email,
  };
  try {
    await new Email(user, site).sendEmailTemplate(
      htmlContentUser,
      "Werk de bestelstatus bij"
    );
  } catch (err) {
    console.log(err);
  }

  res.status(200).send({
    status: true,
    data: updatedOrder,
    message: "Viagra order updated successfully",
  });
};

export const deleteViagraOrder = async (req, res) => {
  const orderId = req.params.id;

  const order = await viagraOrderModel.findById(orderId);
  if (!order) {
    return res.json({ status: false, message: "Viagra order not found" });
  }

  await viagraOrderModel.deleteOne({ _id: orderId });
  res.json({ status: true, message: "Viagra order deleted successfully" });
};
