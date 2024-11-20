const jwt = require("jsonwebtoken");
const User = require("../models/user.model");
const bcrypt = require("bcrypt");

// Utility function to hash passwords
const hashedPassword = async (password) => {
  const salt = await bcrypt.genSalt(10);
  const hashed = await bcrypt.hash(password, salt);
  return hashed;
};

// Controller function for user registration
// const createUser = async (req, res) => {
//   try {
//     const { email, password } = req.body;

//     const alreadyRegistered = await User.findOne({ email });

//     if (alreadyRegistered) {
//       return res.status(400).json({
//         status: "fail",
//         message: "User already registered",
//       });
//     }

//     // Hash the user password
//     const securedPassword = await hashedPassword(req.body.password);

//     // Create a new user instance
//     const user = new User({
//       name: req.body.name,
//       email: req.body.email,
//       password: securedPassword,
//       image: req.file ? req.file.filename : null, // Store the image filename
//       is_admin: false, // Default role for user
//     });

//     // Save the user to the database
//     const userSaved = await user.save();

//     if (userSaved) {
//       res.status(201).json({
//         status: "success",
//         message: "User registered successfully! Please verify your email.",
//         data: {
//           user,
//         },
//       });
//     } else {
//       res.status(400).json({
//         status: "fail",
//         message: "User registration failed. Please try again.",
//       });
//     }
//   } catch (e) {
//     // Handle errors during user registration
//     res.status(500).json({
//       status: "fail",
//       message: "Internal server error",
//       error: e.message,
//     });
//   }
// };
const { body, validationResult } = require("express-validator");

const createUser = async (req, res) => {
  try {
    // Validate request body
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        status: "fail",
        message: "Invalid input data",
        errors: errors.array(),
      });
    }

    const { email, password } = req.body;

    // Check if the user is already registered
    const alreadyRegistered = await User.findOne({ email });
    if (alreadyRegistered) {
      return res.status(400).json({
        status: "fail",
        message: "User already registered",
      });
    }

    // Hash the user password
    const securedPassword = await hashedPassword(password);

    // Create a new user instance
    const user = new User({
      name: req.body.name,
      email: req.body.email,
      password: securedPassword,
      image: req.file ? req.file.filename : null, // Store the image filename
      is_admin: false, // Default role for user
    });

    // Save the user to the database
    const userSaved = await user.save();
    if (userSaved) {
      return res.status(201).json({
        status: "success",
        message: "User registered successfully! Please verify your email.",
        data: { user },
      });
    } else {
      return res.status(400).json({
        status: "fail",
        message: "User registration failed. Please try again.",
      });
    }
  } catch (e) {
    // Handle errors during user registration
    res.status(500).json({
      status: "fail",
      message: "Internal server error",
      error: e.message,
    });
  }
};

// Login User
const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Check if the user exists
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({
        status: "fail",
        message: "User not found",
      });
    }

    // Validate password
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(401).json({
        status: "fail",
        message: "Invalid credentials",
      });
    }

    // Generate JWT token
    const token = jwt.sign(
      { id: user._id, is_admin: user.is_admin },
      process.env.JWT_SECRET,
      { expiresIn: "1d" }
    );

    // Save user information in session
    req.session.user_id = user._id;
    req.session.is_admin = user.is_admin;

    // Respond to client
    return res.status(200).json({
      status: "success",
      message: "Login successful",
      data: {
        user: {
          id: user._id,
          name: user.name,
          email: user.email,
          is_admin: user.is_admin,
        },
        token,
      },
    });

    // Remove this, as response is already sent above:
    // res.redirect(user.is_admin ? "/admin/dashboard" : "/user/dashboard");
  } catch (e) {
    // Handle server errors
    res.status(500).json({
      status: "fail",
      message: "Internal server error",
      error: e.message,
    });
  }
};


// const loginUser = async (req, res) => {
//   try {
//     const { email, password } = req.body;

//     const user = await User.findOne({ email });
//     if (!user) {
//       return res.status(404).json({
//         status: "fail",
//         message: "User not found",
//       });
//     }

//     const isPasswordValid = await bcrypt.compare(password, user.password);
//     if (!isPasswordValid) {
//       return res.status(401).json({
//         status: "fail",
//         message: "Invalid credentials",
//       });
//     } else {
//       req.session.user_id = user._id;
//       // res.redirect("/admin/dashboard");
//     }

//     const token = jwt.sign(
//       { id: user._id, is_admin: user.is_admin },
//       process.env.JWT_SECRET,
//       { expiresIn: "1d" }
//     );

//     res.status(200).json({
//       status: "success",
//       message: "Login successful",
//       data: {
//         user,
//         token,
//       },
//     });

//     // req.session.user_id = user._id;
//     res.redirect("/admin/dashboard");
//   } catch (e) {
//     res.status(500).json({
//       status: "fail",
//       message: "Internal server error",
//       error: e.message,
//     });
//   }
// };

module.exports = {
  loginUser,
  createUser,
  createUserValidation: [
    body("email").isEmail().withMessage("Please provide a valid email address"),
    body("password")
      .isLength({ min: 6 })
      .withMessage("Password must be at least 6 characters long"),
    body("name").notEmpty().withMessage("Name is required"),
  ],
};
