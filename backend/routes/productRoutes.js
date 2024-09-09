import express from 'express';
import User from '../models/userModel.js';
import Product from '../models/productModel.js';
import upload from '../middleware/uploadProducts.js';
import slugify from 'slugify';
import { isAuth } from '../utils.js';

const productsRouter = express.Router();

// GET Products

productsRouter.get('/', async (req, res) => {
  const products = await User.aggregate([
    { $unwind: '$products' },
    { $replaceRoot: { newRoot: '$products' } },
  ]);

  if (products) {
    res.status(200).json(products);
  } else {
    res.status(404).json({ message: 'No Products here' });
  }
});

// DELETE Product
productsRouter.delete('/delete/:productId', isAuth, async (req, res) => {
  try {
    const { productId } = req.params;

    // Attempt to find and delete the product within the products array
    const result = await User.updateOne(
      { 'products._id': productId }, // Match the product by productId
      { $pull: { products: { _id: productId } } } // Remove the matched product
    );

    if (result.nModified > 0) {
      res.status(200).json({ message: 'Product deleted successfully' });
    } else {
      res.status(404).json({ message: 'Product not found' });
    }
  } catch (error) {
    res.status(500).json({ message: 'Server Error', error: error.message });
  }
});

// UPDATE Product
productsRouter.put('/update/:productId', isAuth, async (req, res) => {
  try {
    const { productId } = req.params;

    // Attempt to find and update the product within the products array
    const result = await User.updateOne(
      { 'products._id': productId }, // Match the product by productId
      {
        $set: {
          'products.$.name': req.body.name,
          'products.$.price': req.body.price,
          'products.$.category': req.body.category,
          'products.$.description': req.body.description,
          'products.$.slug': req.body.slug,
          'products.$.quantity': req.body.quantity,
        },
      }
    );

    if (result.modifiedCount > 0) {
      res.status(200).json({ message: 'Product updated successfully' });
    } else {
      res.status(404).json({ message: 'Product not found' });
    }
  } catch (error) {
    res
      .status(500)
      .json({ message: 'Error updating product', error: error.message });
  }
});

// Add Product

productsRouter.post('/addProduct/:id', isAuth, upload, async (req, res) => {
  try {
    const { productName, price, category, quantity, description } = req.body;
    const imagePaths = req.files.map((file) => file.path);

    // Generate a slug from the product name
    const slug = slugify(productName, { lower: true });

    // Create a new product, but don't save it yet
    const product = new Product({
      name: productName,
      price,
      category,
      quantity,
      description,
      images: imagePaths,
      slug, // Add the generated slug
    });

    // Assign productId to be the same as the automatically generated _id
    product.productId = product._id;

    // Find the user by ID and add the product to their list of products
    const user = await User.findById(req.params.id);
    user.products.push(product);
    await user.save();

    res.status(201).json({ message: 'Product added successfully', product });
  } catch (error) {
    console.error('Error adding product:', error);
    res.status(500).json({ message: 'Failed to add product', error });
  }
});

// Fetch Selected Product

productsRouter.get('/:slug', async (req, res) => {
  const filter = {
    'products.slug': req.params.slug,
  };

  // find product
  const user = await User.findOne(filter);
  const product = user.products.filter(
    (product) => product.slug === req.params.slug
  );

  if (product) {
    res.status(200).json(product);
  } else {
    res.status(404).json({ message: 'Product Not Exist' });
  }
});

// Decrement Available Quantity of Product

productsRouter.put('/decrementavailablequantity', isAuth, async (req, res) => {
  const filter = {
    'products.productId': req.body.productId,
  };

  // Find the user to get the current quantity
  const user = await User.findOne(filter);

  if (user) {
    const product = user.products.find(
      (product) => product.productId.toString() === req.body.productId
    );

    if (product && product.quantity >= req.body.quantity) {
      const update = {
        $inc: { 'products.$.quantity': -req.body.quantity },
      };

      const updateCheck = await User.updateOne(filter, update);

      if (updateCheck.modifiedCount > 0) {
        if (product.quantity === 1) {
          res.status(200).json(product.quantity);
        } else {
          res.status(200).json(updateCheck.acknowledged);
        }
      }
    } else {
      res.status(400).json({ message: 'Current Quantity not available' });
    }
  } else {
    res.status(500).json({ message: 'Failed Operation' });
  }
});

export default productsRouter;
