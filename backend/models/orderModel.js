// import mongoose from 'mongoose';

// const orderSchema = new mongoose.Schema(
//   {
//     orderItems: [
//       {
//         // slug: { type: String, required: true },
//         name: { type: String, required: true },
//         quantity: { type: Number, required: true },
//         // image: { type: String, required: true },
//         price: { type: Number, required: true },
//         product: {
//           type: mongoose.Schema.Types.ObjectId,
//           ref: 'Product',
//           required: true,
//         },
//       },
//     ],

//     shippingAddress: {
//       fullName: { type: String, required: true },
//       address: { type: String, required: true },
//       city: { type: String, required: true },
//       postalCode: { type: String, required: true },
//       country: { type: String, required: true },
//     },

//     paymentMethod: { type: String, required: true },

//     // paymentResult: {
//     //   id: String,
//     //   status: String,
//     //   update_time: String,
//     //   email_address: String,
//     // },

//     shippingPrice: { type: Number, required: true , default: 20 },
//     totalPrice: { type: Number, required: true },
//     user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
//     isPaid: { type: Boolean, default: true },
//     paidAt: { type: Date },
//     isDelivered: { type: Boolean, default: false },
//     // deliveredAt: { type: Date },
//   },

//   {
//     timestamps: true,
//   }
// );

// const Order = mongoose.model('Order', orderSchema);
// export default Order;

import mongoose from 'mongoose';

const orderSchema = new mongoose.Schema(
  {
    orderItems: [
      {
        slug: { type: String, required: true },
        name: { type: String, required: true },
        quantity: { type: Number, required: true },
        price: { type: Number, required: true },
        product: {
          type: mongoose.Schema.Types.ObjectId,
          ref: 'Product',
          required: true,
        },
      },
    ],
    shippingAddress: {
      fullName: { type: String, required: true },
      address: { type: String, required: true },
      city: { type: String, required: true },
      postalCode: { type: String, required: true },
      country: { type: String, required: true },
    },
    paymentMethod: { type: String, required: true },
    paymentDetails: {
      omtTransactionId: { type: String },   // OMT Transaction ID
      wishMoneyReference: { type: String }, // Wish Money Reference
    },
    shippingPrice: { type: Number, required: true },
    totalPrice: { type: Number, required: true },
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    paidAt: { type: Date },
    isPaid: { type: Boolean, default: false },
    isDelivered: { type: Boolean, default: false },
  },
  {
    timestamps: true,
  }
);

const Order = mongoose.model('Order', orderSchema);
export default Order;

