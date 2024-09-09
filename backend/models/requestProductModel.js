import mongoose from 'mongoose';

const requestProductSchema = new mongoose.Schema({
  productId: mongoose.Schema.Types.ObjectId,
  name: { type: String },
  price: { type: Number },
  images: { type: Array },
  category: { type: String },
  description: { type: String },
  slug: { type: String },
  quantity: { type: Number },
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
});

const RequestProduct = mongoose.model('RequestProduct', requestProductSchema);

export default RequestProduct;
