import mongoose from 'mongoose';

const productSchema = new mongoose.Schema({
  productId: mongoose.Schema.Types.ObjectId,
  name: { type: String },
  price: { type: Number },
  images: { type: Array },
  category: { type: String },
  description: { type: String },
  slug: { type: String },
  quantity: { type: Number },
});

const Product = mongoose.model('Product', productSchema);

export default Product;
