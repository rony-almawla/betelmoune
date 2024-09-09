import express from 'express';
import Order from '../models/orderModel.js';
import Stripe from 'stripe';

import nodemailer from 'nodemailer';
import User from '../models/userModel.js';

import asyncHandler from 'express-async-handler';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

const orderRouter = express.Router();

// orderRouter.post('/', async (req, res) => {
//   try {
//     const { orderItems, shippingAddress, paymentMethod, shippingPrice, totalPrice, user, paymentDetails } = req.body;

//     const newOrder = new Order({
//       orderItems,
//       shippingAddress,
//       paymentMethod,
//       shippingPrice,
//       totalPrice,
//       user,
//       paymentDetails: paymentMethod === 'OMT' || paymentMethod === 'Wish Money' ? paymentDetails : null,
//       paidAt: paymentMethod === 'Stripe' ? Date.now() : null, // Only for Stripe
//     });

//     const createdOrder = await newOrder.save();
//     res.status(201).send({ message: 'New Order Created', order: createdOrder });
//   } catch (err) {
//     res.status(500).send({ message: 'Error in Creating Order', error: err.message });
//   }
// });

// Set up Nodemailer transporter
const transporter = nodemailer.createTransport({
  service: 'outlook', // Replace with your email service
  auth: {
    user: 'betelmoune@outlook.com', // Replace with your email
    pass: 'what123what', // Replace with your email password or application-specific password
  },
});

// Function to send email
const sendEmail = async (to, subject, text) => {
  const mailOptions = {
    from: 'betelmoune@outlook.com', // Replace with your email
    to,
    subject,
    text,
  };

  try {
    await transporter.sendMail(mailOptions);
    console.log('Email sent successfully');
  } catch (error) {
    console.error('Error sending email:', error);
  }
};

orderRouter.post('/save-order', async (req, res) => {
  try {
    const {
      orderItems,
      shippingAddress,
      paymentMethod,
      shippingPrice,
      totalPrice,
      user,
      paymentDetails,
    } = req.body;

    const newOrder = new Order({
      orderItems,
      shippingAddress,
      paymentMethod,
      shippingPrice,
      totalPrice,
      user,
      paymentDetails:
        paymentMethod === 'OMT' || paymentMethod === 'Wish Money'
          ? paymentDetails
          : null,
      paidAt: paymentMethod === 'Stripe' ? Date.now() : null, // Only for Stripe
    });

    const createdOrder = await newOrder.save();

    res
      .status(201)
      .send({ message: 'Order saved successfully', order: createdOrder });
  } catch (err) {
    res
      .status(500)
      .send({ message: 'Error in saving order', error: err.message });
  }
});

orderRouter.post('/send-email', async (req, res) => {
  const { orderId, userId } = req.body;

  try {
    // Retrieve the saved order by orderId
    const order = await Order.findById(orderId);
    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }

    // Retrieve user email by userId
    const userDoc = await User.findById(userId);
    if (!userDoc) {
      return res.status(404).json({ message: 'User not found' });
    }

    const userEmail = userDoc.email; // Retrieve user email from the user document

    // Prepare and send email notification
    const emailSubject = 'Order Confirmation';
    const emailText = `Dear ${userDoc.firstName},\n\nThank you for your order!\n\nOrder ID: ${order._id}\nTotal Price: ${order.totalPrice}\n\nShipping Address:\n${order.shippingAddress.fullName}\n${order.shippingAddress.address}\n${order.shippingAddress.city}, ${order.shippingAddress.postalCode}\n${order.shippingAddress.country}\n\nWe will notify you once your order is shipped.\n\nThank you for shopping with us!`;

    await sendEmail(userEmail, emailSubject, emailText);
    res.status(200).json({ message: 'Email sent successfully' });
  } catch (error) {
    res
      .status(500)
      .json({ message: 'Error sending email', error: error.message });
  }
});

// // Route to save an order and send email
// orderRouter.post('/', async (req, res) => {
//   try {
//     const { orderItems, shippingAddress, paymentMethod, shippingPrice, totalPrice, user, paymentDetails } = req.body;

//     const newOrder = new Order({
//       orderItems,
//       shippingAddress,
//       paymentMethod,
//       shippingPrice,
//       totalPrice,
//       user,
//       paymentDetails: paymentMethod === 'OMT' || paymentMethod === 'Wish Money' ? paymentDetails : null,
//       paidAt: Date.now(), // Only for Stripe
//     });

//     const createdOrder = await newOrder.save();

//     // Retrieve user email by user ID
//     const userDoc = await User.findById(user);
//     if (!userDoc) {
//       return res.status(404).json({ message: 'User not found' });
//     }

//     const userEmail = userDoc.email; // Retrieve user email from the user document

//     // Prepare and send email notification
//     const emailSubject = 'Order Confirmation';
//     const emailText = `Dear ${userDoc.firstName},\n\nThank you for your order!\n\nOrder ID: ${createdOrder._id}\nTotal Price: ${createdOrder.totalPrice}\n\nShipping Address:\n${createdOrder.shippingAddress.fullName}\n${createdOrder.shippingAddress.address}\n${createdOrder.shippingAddress.city}, ${createdOrder.shippingAddress.postalCode}\n${createdOrder.shippingAddress.country}\n\nWe will notify you once your order is shipped.\n\nThank you for shopping with us!`;
//     await sendEmail(userEmail, emailSubject, emailText);

//     res.status(201).send({ message: 'New Order Created and Email Sent', order: createdOrder });
//   } catch (err) {
//     res.status(500).send({ message: 'Error in Creating Order', error: err.message });
//   }
// });

orderRouter.post('/create-payment-intent', async (req, res) => {
  const { totalPrice } = req.body;

  try {
    const paymentIntent = await stripe.paymentIntents.create({
      amount: Math.round(totalPrice * 100), // Convert to cents
      currency: 'usd',
    });

    res.send({
      clientSecret: paymentIntent.client_secret,
    });
  } catch (err) {
    res
      .status(500)
      .send({ message: 'Error creating payment intent', error: err.message });
  }
});

orderRouter.get('/', async (req, res) => {
  const orders = await Order.find();
  res.send(orders);
});

orderRouter.delete('/delete/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const deletedOrder = await Order.findByIdAndDelete(id);

    if (!deletedOrder) {
      return res.status(404).json({ message: 'Order not found' });
    }

    res.status(200).json({ message: 'Order deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error });
  }
});

// update the delivery status
orderRouter.put(
  '/:id/deliver',
  asyncHandler(async (req, res) => {
    const order = await Order.findById(req.params.id);

    if (order) {
      order.isDelivered = !order.isDelivered;
      order.deliveredAt = order.isDelivered ? Date.now() : null;
      const updatedOrder = await order.save();
      res.status(200).send({
        message: 'Order delivery status updated',
        order: updatedOrder,
      });
    } else {
      res.status(404).send({ message: 'Order not found' });
    }
  })
);

export default orderRouter;
