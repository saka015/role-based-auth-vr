const jwt = require("jsonwebtoken");
const User = require("../models/user.model");
const bcrypt = require("bcrypt");
const { body, validationResult } = require("express-validator");
const { get } = require("mongoose");

// const sendMail = require("../utils/SendEmail");

const hashedPassword = async (password) => {
  const salt = await bcrypt.genSalt(10);
  const hashed = await bcrypt.hash(password, salt);
  return hashed;
};

const createUser = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        status: "fail",
        message: "Invalid input data",
        errors: errors.array(),
      });
    }

    const { email, password } = req.body;
    const alreadyRegistered = await User.findOne({ email });
    if (alreadyRegistered) {
      return res
        .status(400)
        .json({ status: "fail", message: "User already registered" });
    }

    const securedPassword = await hashedPassword(password);
    const user = new User({
      name: req.body.name,
      email: req.body.email,
      password: securedPassword,
      image: req.file ? req.file.filename : null,
    });

    const userSaved = await user.save();
    if (userSaved) {
      return res.status(201).json({
        status: "success",
        message: "User registered successfully!",
        data: { user },
      });
    } else {
      return res
        .status(400)
        .json({ status: "fail", message: "User registration failed." });
    }
  } catch (e) {
    res.status(500).json({
      status: "fail",
      message: "Internal server error",
      error: e.message,
    });
  }
};

const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user) {
      return res
        .status(404)
        .json({ status: "fail", message: "User not found" });
    }

    if (user.status === "inactive") {
      return res.status(401).json({
        status: "fail",
        message: "User is inactive. Please contact your admin!",
      });
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res
        .status(401)
        .json({ status: "fail", message: "Invalid credentials" });
    }

    const token = jwt.sign(
      { id: user._id, is_admin: user.is_admin },
      process.env.JWT_SECRET,
      { expiresIn: "1d" }
    );
    return res.status(200).json({
      status: "success",
      message: "Login successful",
      data: {
        user: {
          id: user._id,
          name: user.name,
          email: user.email,
          role: user.role,
        },
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

const getUserData = async (req, res) => {
  try {
    const userId = req.user.id;
    const user = await User.findById(userId);
    if (!user) {
      return res
        .status(404)
        .json({ status: "fail", message: "User not found" });
    }
    res.json(user);
  } catch (e) {
    res.status(500).json({
      status: "fail",
      message: "Internal server error",
      error: e.message,
    });
  }
};

const getAllUser = async (req, res) => {
  try {
    const user = await User.find({});
    if (!user) {
      return res
        .status(404)
        .json({ status: "fail", message: "User not found" });
    }
    res.json(user);
  } catch (e) {
    res.status(500).json({
      status: "fail",
      message: "Internal server error",
      error: e.message,
    });
  }
};

const deleteUser = async (req, res) => {
  try {
    const userId = req.params.id;
    const deletedUser = await User.findByIdAndDelete(userId);
    if (!deletedUser) {
      return res
        .status(404)
        .json({ success: false, message: "User not found" });
    }

    // const { email } = req.body;
    // const user = await User.findOne({ email });
    // if (user?.role !== "admin") {
    //   return res
    //     .status(404)
    //     .json({ status: "fail", message: "You are not authorized" });
    // }

    res
      .status(200)
      .json({ success: true, message: "User deleted successfully" });
  } catch (error) {
    console.error("Error deleting user:", error.stack);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
};

const editUser = async (req, res) => {
  try {
    const { id: userId } = req.params; // Destructure userId from params
    const { role, status } = req.body; // Destructure role and status from body

    // Input Validation
    if (!userId) {
      return res.status(400).json({ error: "Missing userId" });
    }
    if (!role && !status) {
      return res.status(400).json({
        error: "Provide at least one field to update: role or status",
      });
    }

    // Prepare update data dynamically
    const updateData = {};
    if (role) updateData.role = role;
    if (status) updateData.status = status;

    // Update user and return updated data
    const updatedUser = await User.findByIdAndUpdate(userId, updateData, {
      new: true,
    });

    if (!updatedUser) {
      return res.status(404).json({ message: "User not found" });
    }

    return res.json({
      message: "User updated successfully",
      user: updatedUser,
    });
  } catch (error) {
    console.error("Error updating user:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};


const adminCreateUser = async (req, res) => {
  try {
    const { email, name, role } = req.body;

    // Validate input
    if (!email || !name) {
      return res.status(400).json({
        status: "fail",
        message: "Name and email are required.",
      });
    }

    // Check if user with the email already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({
        status: "fail",
        message: "User with this email already exists.",
      });
    }

    // Generate and hash the temporary password
    const temporaryPassword = "123456";
    const hashedPassword = await bcrypt.hash(temporaryPassword, 10);

    // Create and save the new user
    const newUser = new User({
      name,
      email,
      password: hashedPassword,
      role: role || "user", // Default to 'user' role if not provided
      image: null, // Explicitly set image to null
    });

    const savedUser = await newUser.save();

    return res.status(201).json({
      status: "success",
      message: "User created successfully!",
      data: savedUser,
    });
  } catch (error) {
    console.error("Error creating user:", error);
    return res.status(500).json({
      status: "fail",
      message: "Internal server error",
      error: error.message, // Include error message for debugging
    });
  }
};
module.exports = {
  loginUser,
  createUser,
  getUserData,
  getAllUser,
  deleteUser,
  editUser,
  adminCreateUser,
  createUserValidation: [
    body("email").isEmail().withMessage("Please provide a valid email address"),
    body("password")
      .isLength({ min: 6 })
      .withMessage("Password must be at least 6 characters long"),
    body("name").notEmpty().withMessage("Name is required"),
  ],
};
