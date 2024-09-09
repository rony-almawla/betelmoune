import express from 'express';
import User from '../models/userModel.js';
import Workshop from '../models/workshopModel.js';
import bcrypt from 'bcryptjs';
import { isAuth, isAdmin, generateToken,  } from '../utils.js';
import asyncHandler from 'express-async-handler';
import upload from '../middleware/upload.js';
import uploadProducts from '../middleware/uploadProducts.js';
import fs from 'fs';
import path from 'path';

const userRouter = express.Router();

// Get all users (protected route, requires token)
userRouter.get('/', isAuth, isAdmin, asyncHandler(async (req, res) => {
  const users = await User.find();
  res.send(users);
}));

// Delete user by ID (protected route, requires token)
userRouter.delete('/delete/:id', isAuth, isAdmin, asyncHandler(async (req, res) => {
  const { id } = req.params;
  const deletedUser = await User.findByIdAndDelete(id);

  if (!deletedUser) {
    return res.status(404).json({ message: 'User not found' });
  }

  res.status(200).json({ message: 'User deleted successfully' });
}));

// Update user by ID (protected route, requires token)
userRouter.put('/:id', isAuth, asyncHandler(async (req, res) => {
  const user = await User.findById(req.params.id);

  if (user) {
    user.firstName = req.body.firstName || user.firstName;
    user.lastName = req.body.lastName || user.lastName;
    user.email = req.body.email || user.email;
    user.isAdmin = req.body.isAdmin !== undefined ? req.body.isAdmin : user.isAdmin;
    if (req.body.password) {
      user.password = bcrypt.hashSync(req.body.password);
    }

    const updatedUser = await user.save();

    res.json({
      _id: updatedUser._id,
      firstName: updatedUser.firstName,
      lastName: updatedUser.lastName,
      email: updatedUser.email,
      isAdmin: updatedUser.isAdmin,
      products: updatedUser.products,
      workshops: updatedUser.workshops,
      bio: updatedUser.bio,
      profileImage: updatedUser.profileImage,
    });
  } else {
    res.status(404).send({ message: 'User not found' });
  }
}));

// Sign in route (public route)
userRouter.post('/signin', asyncHandler(async (req, res) => {
  const user = await User.findOne({ email: req.body.email });

  if (user && bcrypt.compareSync(req.body.password, user.password)) {
    res.send({
      _id: user._id,
      firstName: user.firstName,
      lastName: user.lastName,
      email: user.email,
      isAdmin: user.isAdmin,
      products: user.products,
      workshops: user.workshops,
      cart: user.cart,
      token: generateToken(user), // Generate and send JWT token
      bio: user.bio,
      profileImage: user.profileImage,
    });
  } else {
    res.status(401).send({ message: 'Invalid email or password!!' });
  }
}));

// Sign up route (public route)
userRouter.post('/signup', asyncHandler(async (req, res) => {
  const newUser = new User({
    firstName: req.body.firstName,
    lastName: req.body.lastName,
    email: req.body.email,
    password: bcrypt.hashSync(req.body.password),
    products: [],
    bio: '',
    profileImage: '',
  });

  const user = await newUser.save();

  if (user) {
    res.send({
      _id: user._id,
      firstName: user.firstName,
      lastName: user.lastName,
      email: user.email,
      isAdmin: user.isAdmin,
      products: user.products,
      workshops: user.workshops,
      cart: user.cart,
      token: generateToken(user), // Generate and send JWT token
      bio: user.bio,
      profileImage: user.profileImage,
    });
  } else {
    res.status(404).send({ message: 'Failed To SignUp try again later' });
  }
}));

// Get user by ID (protected route, requires token)
userRouter.get('/:id', isAuth, asyncHandler(async (req, res) => {
  const user = await User.findById(req.params.id);

  if (user) {
    res.json({
      _id: user._id,
      firstName: user.firstName,
      lastName: user.lastName,
      email: user.email,
      isAdmin: user.isAdmin,
      products: user.products,
      workshops: user.workshops,
      bio: user.bio,
      profileImage: user.profileImage,
    });
  } else {
    res.status(404).send({ message: 'User not found' });
  }
}));

// Update user profile (protected route, requires token)
userRouter.put('/profile', isAuth, asyncHandler(async (req, res) => {
  const user = await User.findById(req.body.id);

  if (user) {
    user.firstName = req.body.firstName || user.firstName;
    user.lastName = req.body.lastName || user.lastName;
    user.email = req.body.email || user.email;
    user.bio = req.body.bio || user.bio;
    if (req.body.password) {
      user.password = bcrypt.hashSync(req.body.password);
    }

    const updatedUser = await user.save();

    res.json({
      _id: updatedUser._id,
      firstName: updatedUser.firstName,
      lastName: updatedUser.lastName,
      email: updatedUser.email,
      isAdmin: updatedUser.isAdmin,
      products: updatedUser.products,
      workshops: updatedUser.workshops,
      token: generateToken(updatedUser), // Generate and send JWT token
      bio: updatedUser.bio,
      profileImage: updatedUser.profileImage,
    });
  } else {
    res.status(404).send({ message: 'User not found' });
  }
}));

// Upload user profile image (protected route, requires token)
userRouter.post('/uploadProfileImage', isAuth, upload.single('profileImage'), asyncHandler(async (req, res) => {
  if (req.file) {
    const user = await User.findById(req.body.id);

    if (user) {
      // Delete old profile image if it exists
      if (user.profileImage) {
        const oldImagePath = path.join(__dirname, '..', user.profileImage);
        if (fs.existsSync(oldImagePath)) {
          fs.unlinkSync(oldImagePath); // Delete the old image
        }
      }

      user.profileImage = `/${req.file.path}`;
      await user.save();

      res.status(200).json({
        path: user.profileImage,
      });
    } else {
      res.status(404).send({ message: 'User not found' });
    }
  } else {
    res.status(400).send({ message: 'No file uploaded' });
  }
}));

// Update user's product (protected route, requires token)
userRouter.put('/user/products/:userId', isAuth, uploadProducts, asyncHandler(async (req, res) => {
  const { userId } = req.params;
  const { productId } = req.body;
  const { name, price, category, description, quantity } = req.body;
  const images = req.files.map((file) => file.path);

  try {
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    const product = user.products.id(productId);
    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }

    product.name = name;
    product.price = price;
    product.category = category;
    product.description = description;
    product.quantity = quantity;

    // Delete old product images if new ones are provided
    if (images.length) {
      product.images.forEach((oldImage) => {
        const oldImagePath = path.join(__dirname, '..', oldImage);
        if (fs.existsSync(oldImagePath)) {
          fs.unlinkSync(oldImagePath); // Delete the old image
        }
      });
      product.images = images; // Update with new images
    }

    await user.save();

    res.json({ message: 'Product updated successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error });
  }
}));

// Get user's products (protected route, requires token)
userRouter.get('/user/products/:userId', isAuth, asyncHandler(async (req, res) => {
  const { userId } = req.params;
  const user = await User.findById(userId);
  if (!user) {
    return res.status(404).json({ message: 'User not found' });
  }

  res.json(user.products);
}));

// Update user's workshops (protected route, requires token)
userRouter.put('/:userId/workshops', isAuth, asyncHandler(async (req, res) => {
  const { userId } = req.params;
  const { workshopId, workshopData } = req.body;

  try {
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    const workshopIndex = user.workshops.findIndex(
      (workshop) => workshop._id.toString() === workshopId
    );
    if (workshopIndex !== -1) {
      user.workshops[workshopIndex] = workshopData;
    } else {
      user.workshops.push(workshopData);
    }

    await user.save();

    // Remove user from the workshop's registeredUsers list
    const workshop = await Workshop.findById(workshopId);
    if (workshop) {
      workshop.registeredUsers = workshop.registeredUsers.filter(
        (id) => id.toString() !== userId.toString()
      );
      await workshop.save();
    } else {
      return res.status(404).json({ message: 'Workshop not found' });
    }

    res.status(200).json({ message: 'Workshops updated successfully', user });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
}));

// Get user's workshops (protected route, requires token)
userRouter.get('/myworkshops/:userId', isAuth, asyncHandler(async (req, res) => {
  const { userId } = req.params;
  const user = await User.findById(userId).populate('workshops');
  if (!user) {
    return res.status(404).json({ message: 'User not found' });
  }

  res.json(user.workshops);
}));

export default userRouter;




// import express from 'express';
// import User from '../models/userModel.js';
// import Workshop from '../models/workshopModel.js';
// import bcrypt from 'bcryptjs';
// import { isAuth, isAdmin, generateToken, sendEmail } from '../utils.js';
// import asyncHandler from 'express-async-handler';
// import upload from '../middleware/upload.js';
// import uploadProducts from '../middleware/uploadProducts.js';
// // const fs = require('fs');
// // const path = require('path');
// import fs from 'fs';
// import path from 'path';

// const userRouter = express.Router();

// userRouter.get('/', async (req, res) => {
//   const users = await User.find();
//   res.send(users);
// });

// userRouter.delete('/delete/:id', async (req, res) => {
//   try {
//     const { id } = req.params;
//     const deletedUser = await User.findByIdAndDelete(id);

//     if (!deletedUser) {
//       return res.status(404).json({ message: 'User not found' });
//     }

//     res.status(200).json({ message: 'User deleted successfully' });
//   } catch (error) {
//     res.status(500).json({ message: 'Server error', error });
//   }
// });

// userRouter.put(
//   '/:id',
//   asyncHandler(async (req, res) => {
//     try {
//       const user = await User.findById(req.params.id);

//       if (user) {
//         user.firstName = req.body.firstName || user.firstName;
//         user.lastName = req.body.lastName || user.lastName;
//         user.email = req.body.email || user.email;
//         user.isAdmin =
//           req.body.isAdmin !== undefined ? req.body.isAdmin : user.isAdmin;
//         if (req.body.password) {
//           user.password = bcrypt.hashSync(req.body.password);
//         }

//         const updatedUser = await user.save();

//         res.json({
//           _id: updatedUser._id,
//           firstName: updatedUser.firstName,
//           lastName: updatedUser.lastName,
//           email: updatedUser.email,
//           isAdmin: updatedUser.isAdmin,
//           products: updatedUser.products,
//           workshops: updatedUser.workshops,
//           bio: updatedUser.bio,
//           profileImage: updatedUser.profileImage,
//         });
//       } else {
//         res.status(404).send({ message: 'User not found' });
//       }
//     } catch (error) {
//       res.status(500).send({ message: 'Error updating user', error });
//     }
//   })
// );

// userRouter.post('/signin', async (req, res) => {
//   console.log(req.body.email);
//   const user = await User.findOne({ email: req.body.email });

//   if (user) {
//     // sendEmail(user , user.email);
//     if (bcrypt.compareSync(req.body.password, user.password)) {
//       return res.send({
//         _id: user._id,
//         firstName: user.firstName,
//         lastName: user.lastName,
//         email: user.email,
//         isAdmin: user.isAdmin,
//         products: user.products,
//         workshops: user.workshops,
//         cart: user.cart,
//         token: generateToken(user),
//         bio: user.bio,
//         profileImage: user.profileImage,
//       });
//     }
//   }

//   res.status(401).send({ message: 'Invalid email or password!!' });
// });

// userRouter.post('/signup', async (req, res) => {
//   const newUser = new User({
//     firstName: req.body.firstName,
//     lastName: req.body.lastName,
//     email: req.body.email,
//     password: bcrypt.hashSync(req.body.password),
//     products: [],
//     bio: '',
//     profileImage: '',
//   });

//   const user = await newUser.save();

//   if (user) {
//     return res.send({
//       _id: user._id,
//       firstName: user.firstName,
//       lastName: user.lastName,
//       email: user.email,
//       isAdmin: user.isAdmin,
//       products: user.products,
//       workshops: user.workshops,
//       cart: user.cart,
//       token: generateToken(user),
//       bio: user.bio,
//       profileImage: user.profileImage,
//     });
//   }

//   res.status(404).send({ message: 'Failed To SignUp try again later' });
// });

// userRouter.get('/:id', async (req, res) => {
//   try {
//     // Replace with your user identification logic

//     console.log('user idd paramss',req.params.id);

//     const updatedUser = await User.findById(req.params.id);

//     if (!updatedUser) {
//       return res.status(404).send('User not found');
//     }

//     console.log(updatedUser)

//     res.json({
//       _id: updatedUser._id,
//       firstName: updatedUser.firstName,
//       lastName: updatedUser.lastName,
//       email: updatedUser.email,
//       isAdmin: updatedUser.isAdmin,
//       products: updatedUser.products,
//       workshops: updatedUser.workshops,
//       // token: generateToken(user),
//       bio: updatedUser.bio,
//       profileImage: updatedUser.profileImage,
//     });
//   } catch (error) {
//     res.status(500).send('Server error');
//   }
// });

// userRouter.put(
//   '/profile',
//   isAuth,
//   asyncHandler(async (req, res) => {
//     const user = await User.findById(req.body.id);

//     if (user) {
//       user.firstName = req.body.firstName || user.firstName;
//       user.lastName = req.body.lastName || user.lastName;
//       user.email = req.body.email || user.email;
//       user.bio = req.body.bio || user.bio;
//       if (req.body.password) {
//         user.password = bcrypt.hashSync(req.body.password);
//       }

//       const updatedUser = await user.save();

//       res.json({
//         _id: updatedUser._id,
//         firstName: updatedUser.firstName,
//         lastName: updatedUser.lastName,
//         email: updatedUser.email,
//         isAdmin: user.isAdmin,
//         products: user.products,
//         workshops: user.workshops,
//         token: generateToken(user),
//         bio: updatedUser.bio,
//         profileImage: updatedUser.profileImage,
//       });
//     } else {
//       res.status(404);
//       throw new Error('User not found');
//     }
//   })
// );

// userRouter.post(
//   '/uploadProfileImage',
//   upload.single('profileImage'),
//   asyncHandler(async (req, res) => {
//     if (req.file) {
//       const user = await User.findById(req.body.id);

//       if (user) {
//         user.profileImage = `/${req.file.path}`;
//         await user.save();

//         res.status(200).json({
//           path: user.profileImage,
//         });
//       } else {
//         res.status(404);
//         throw new Error('User not found');
//       }
//     } else {
//       res.status(400);
//       throw new Error('No file uploaded');
//     }
//   })
// );

// userRouter.put('/user/products/:userId', uploadProducts, async (req, res) => {
//   const { userId } = req.params;
//   const { productId } = req.body;
//   const { name, price, category, description, quantity } = req.body;
//   const images = req.files.map((file) => file.path);

//   console.log(req.body);
//   console.log(req.files);

//   try {
//     const user = await User.findById(userId);
//     if (!user) {
//       return res.status(404).json({ message: 'User not found' });
//     }

//     const product = user.products.id(productId);
//     if (!product) {
//       return res.status(404).json({ message: 'Product not found' });
//     }

//     product.name = name;
//     product.price = price;
//     product.category = category;
//     product.description = description;
//     product.quantity = quantity;

//     if (images.length) {
//       // Delete old images if new ones are provided
//       product.images.forEach((oldImage) => {
//         const oldImagePath = path.join(__dirname, '..', oldImage);
//         if (fs.existsSync(oldImagePath)) {
//           fs.unlinkSync(oldImagePath); // Delete the old image
//         }
//       });

//       console.log('images::', images);
//       product.images = images; // Update with new images
//     }

//     await user.save();

//     res.json({ message: 'Product updated successfully' });
//   } catch (error) {
//     res.status(500).json({ message: 'Server error', error });
//   }
// });

// userRouter.get('/user/products/:userId', async (req, res) => {
//   try {
//     const { userId } = req.params;
//     const user = await User.findById(userId);
//     if (!user) return res.status(404).json({ message: 'User not found' });

//     res.json(user.products);
//   } catch (error) {
//     res.status(500).json({ message: 'Error fetching products', error });
//   }
// });

// userRouter.put('/:userId/workshops', async (req, res) => {
//   const { userId } = req.params;
//   const { workshopId, workshopData } = req.body;

//   try {
//     const user = await User.findById(userId);
//     if (!user) {
//       return res.status(404).json({ message: 'User not found' });
//     }

//     const workshopIndex = user.workshops.findIndex(
//       (workshop) => workshop._id.toString() === workshopId
//     );
//     if (workshopIndex !== -1) {
//       user.workshops[workshopIndex] = workshopData;
//     } else {
//       user.workshops.push(workshopData);
//     }

//     await user.save();

//     const workshop = await Workshop.findById(workshopId);
//     if (workshop) {
//       // console.log('Registered Users before removal:', workshop.registeredUsers);
//       workshop.registeredUsers = workshop.registeredUsers.filter(
//         (id) => id.toString() !== userId.toString()
//       );
//       // console.log('Registered Users after removal:', workshop.registeredUsers);

//       await workshop.save();
//     } else {
//       return res.status(404).json({ message: 'Workshop not found' });
//     }

//     res.status(200).json({ message: 'Workshops updated successfully', user });
//   } catch (error) {
//     console.error(error);
//     res.status(500).json({ message: 'Server error' });
//   }
// });

// userRouter.get('/myworkshops/:userId', async (req, res) => {
//   const { userId } = req.params;
//   try {
//     const user = await User.findById(userId).populate('workshops');
//     if (user) {
//       res.json(user.workshops);
//     } else {
//       res.status(404).json({ message: 'User not found' });
//     }
//   } catch (error) {
//     res.status(500).json({ message: 'Server error' });
//   }
// });

// export default userRouter;
