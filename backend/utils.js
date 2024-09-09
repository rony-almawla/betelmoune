// Import necessary modules and configurations
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';

dotenv.config();

// Function to generate JWT token
export const generateToken = (user) => {
  return jwt.sign(
    {
      _id: user._id,
      name: user.name,
      email: user.email,
      isAdmin: user.isAdmin,
    },
    process.env.JWT_SECRET,
    {
      expiresIn: '30d',
    }
  );
};

// Middleware to verify if user is authenticated
export const isAuth = (req, res, next) => {
  const authorization = req.headers.authorization;
  if (authorization) {
    const token = authorization.slice(7); // Remove "Bearer " from the token string

    jwt.verify(token, process.env.JWT_SECRET, (err, decode) => {
      if (err) {
        res.status(401).send({ message: 'Invalid Token' });
      } else {
        req.user = decode; // Attach decoded user information to request object
        next();
      }
    });
  } else {
    res.status(401).send({ message: 'No Token' });
  }
};

// Middleware to check if user is an admin
export const isAdmin = (req, res, next) => {
  if (req.user && req.user.isAdmin) {
    next();
  } else {
    res.status(401).send({ message: 'Unauthorized: Admin Token Required' });
  }
};

// Example function to handle successful login and store token in localStorage
export const handleLogin = (token) => {
  localStorage.setItem('token', token); // Store token in localStorage
};

// Example function to retrieve token from localStorage
export const getTokenFromLocalStorage = () => {
  return localStorage.getItem('token');
};

// Example function to remove token from localStorage on logout
export const handleLogout = () => {
  localStorage.removeItem('token');
};


// import jwt from 'jsonwebtoken';
// import dotenv from 'dotenv';

// dotenv.config();

// export const generateToken = (user) => {
//   return jwt.sign(
//     {
//       _id: user._id,
//       name: user.name,
//       email: user.email,
//       isAdmin: user.isAdmin,
//     },
//     process.env.JWT_SECRET,
//     {
//       expiresIn: '30d',
//     }
//   );
// };

// export const isAuth = (req, res, next) => {
//   const authorization = req.headers.authorization;
//   if (authorization) {
//     //Get the token from authorization
//     const token = authorization.slice(0, authorization.length); // Bearer XXXXXX

//     jwt.verify(token, process.env.JWT_SECRET, (err, decode) => {
//       if (err) {
//         res.status(401).send({ message: 'Invalid Token' });
//       } else {
//         req.user = decode;
//         next();
//       }
//     });
//   } else {
//     res.status(401).send({ message: 'No Token' });
//   }
// };

// export const isAdmin = (req, res, next) => {
//   if (req.user && req.user.isAdmin) {
//     next();
//   } else {
//     res.status(401).send({ message: 'Invalid Admin Token' });
//   }
// };

// export const sendEmail = (user, email) => {
//   const transporter = nodemailer.createTransport({
//     service: 'outlook',
//     auth: {
//       user: process.env.EMAIL,
//       pass: process.env.PASSWORD,
//     },
//   });

//   const mailOptions = {
//     from: 'mhamad_jomaa@outlook.com',
//     to: email,
//     subject: 'Sign In ',
//     text: `Welcome Back ${user.name}`,
//   };

//   transporter.sendMail(mailOptions, (error, info) => {
//     if (error) {
//       console.error(error);
//     } else {
//       console.log('Email sent: ' + info.response);
//     }
//   });
// };
