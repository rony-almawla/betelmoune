import express from 'express';
import upload from '../middleware/uploadProducts.js';
import RequestProduct from '../models/requestProductModel.js';
import User from '../models/userModel.js';
import Product from '../models/productModel.js';
import nodemailer from 'nodemailer';


const reqProductRouter = express.Router();

reqProductRouter.get('/', async (req, res) => {
  try {

    const requestProducts = await RequestProduct.find();

    res.status(200).json(requestProducts);
  } catch (error) {
    console.error('Error fetching request products:', error);

    res.status(500).json({ message: 'Failed to fetch request products', error });
  }
});


reqProductRouter.post('/addProduct/:userId', upload , async (req, res) => {

    console.log('Request body:', req.body);
    console.log('Uploaded files:', req.files);

    const { productName, price, category, quantity, description } = req.body;
    const userId = req.params.userId;
    
    const images = req.files.map((file) => file.path); // Save file paths to the images array
  
    try {
      const newProduct = new RequestProduct({
        productId: null,  // You can set this later when the product is officially added
        name: productName,
        price,
        category,
        quantity,
        description,
        images,
        user: userId,
        slug: productName.toLowerCase().split(' ').join('-'), // Automatically generate slug
      });
  
      await newProduct.save();
  
      res.status(201).json({ message: 'Product submitted for review successfully' });
    } catch (error) {
      res.status(500).json({ message: 'Error submitting the product', error: error.message });
    }

});

reqProductRouter.put('/:productId/admit', async (req, res) => {
  try {
    const { productId } = req.params;


    // Find the requested product
    const requestProduct = await RequestProduct.findById(productId);
    if (!requestProduct) {
      return res.status(404).json({ message: 'Requested product not found' });
    }

    // Create a new product instance with the same data
    const newProduct = new Product({
      name: requestProduct.name,
      price: requestProduct.price,
      category: requestProduct.category,
      quantity: requestProduct.quantity,
      description: requestProduct.description,
      images: requestProduct.images,
      slug: requestProduct.slug, // Assuming your RequestProduct has a slug field
    });

    // Assign productId to be the same as the automatically generated _id
    newProduct.productId = newProduct._id;

    // Find the user by ID (assuming the user ID is passed in the request body)
    const user = await User.findById(req.body.userId);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Add the new product to the user's products array
    user.products.push(newProduct);
    await user.save();

    // Remove the product from the RequestProducts collection
    await RequestProduct.findByIdAndDelete(productId);


    res.status(200).json({ message: 'Product admitted successfully and moved to user products', product: newProduct });

  } catch (error) {
    console.error('Error admitting product:', error);
    res.status(500).json({ message: 'Failed to admit product', error });
  }
});

  

// reqProductRouter.delete('/:productId', async (req, res) => {
//   try {
//     const { productId } = req.params;

//     // Find and delete the requested product from the collection
//     const deletedProduct = await RequestProduct.findByIdAndDelete(productId);
//     if (!deletedProduct) {
//       return res.status(404).json({ message: 'Requested product not found' });
//     }

//     res.status(200).json({ message: 'Product rejected and deleted successfully' });
//   } catch (error) {
//     console.error('Error rejecting product:', error);
//     res.status(500).json({ message: 'Failed to reject product', error });
//   }
// });

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

// // Route to handle product rejection and send email
// reqProductRouter.delete('/:productId', async (req, res) => {
//   try {
//     const { productId } = req.params;

//     // Find and delete the requested product from the collection
//     const deletedProduct = await RequestProduct.findByIdAndDelete(productId);
//     console.log('delll', deletedProduct)
//     if (!deletedProduct) {
//       return res.status(404).json({ message: 'Requested product not found' });
//     }

//     // Retrieve user email by user ID
//     const userId = deletedProduct.user; // Assuming the user ID is stored in the product
//     const user = await User.findById(userId);
//     if (!user) {
//       return res.status(404).json({ message: 'User not found' });
//     }

//     const userEmail = user.email; // Retrieve user email from the user document

//     console.log('emailll' , userEmail)

//     // Prepare and send email notification
//     const emailSubject = 'Product Rejection Notification';
//     const emailText = `Dear user,\n\nYour product request with ID ${productId} has been rejected and removed from our system.\n\nThank you.`;
//     await sendEmail(userEmail, emailSubject, emailText);

//     res.status(200).json({ message: 'Product rejected and email sent successfully' });
//   } catch (error) {
//     console.error('Error rejecting product:', error);
//     res.status(500).json({ message: 'Failed to reject product', error });
//   }
// });

// Route to handle product rejection (deletion only)

reqProductRouter.delete('/:productId', async (req, res) => {
  try {
    const { productId } = req.params;

    // Find and delete the requested product from the collection
    const deletedProduct = await RequestProduct.findByIdAndDelete(productId);
    if (!deletedProduct) {
      return res.status(404).json({ message: 'Requested product not found' });
    }


    res.status(200).json({ message: 'Product rejected successfully' });

  } catch (error) {
    console.error('Error rejecting product:', error);
    res.status(500).json({ message: 'Failed to reject product', error });
  }
});


// Route to send rejection email
reqProductRouter.post('/send-email/:userId/:productId', async (req, res) => {
  try {
    const { userId, productId } = req.params;

    // Retrieve user email by user ID
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    const userEmail = user.email; // Retrieve user email from the user document

    // Prepare and send email notification
    const emailSubject = 'Product Rejection Notification';
    const emailText = `Dear user,\n\nYour product request with ID ${productId} has been rejected and removed from our system.\n\nThank you.`;
    await sendEmail(userEmail, emailSubject, emailText);

    res.status(200).json({ message: 'Email sent successfully' });
  } catch (error) {
    console.error('Error sending email:', error);
    res.status(500).json({ message: 'Failed to send email', error });
  }
});





export default reqProductRouter;
// module.exports = reqProductRouter;

