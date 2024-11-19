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
const createUser = async (req, res) => {
  try {
    // Hash the user password
    const securedPassword = await hashedPassword(req.body.password);

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
      res.status(201).json({
        status: "success",
        message: "User registered successfully! Please verify your email.",
        data: {
          user,
        },
      });
    } else {
      res.status(400).json({
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

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({
        status: "fail",
        message: "User not found",
      });
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(401).json({
        status: "fail",
        message: "Invalid credentials",
      });
    }

    const token = jwt.sign(
      { id: user._id, is_admin: user.is_admin },
      process.env.JWT_SECRET,
      { expiresIn: "1d" }
    );

    res.status(200).json({
      status: "success",
      message: "Login successful",
      data: {
        user,
        token,
      },
    });
  } catch (e) {
    res.status(500).json({
      status: "fail",
      message: "Internal server error",
      error: e.message,
    });
  }
};



module.exports = {
  loginUser,
  createUser,
};
