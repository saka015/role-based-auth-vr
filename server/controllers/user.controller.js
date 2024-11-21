const jwt = require("jsonwebtoken");
const User = require("../models/user.model");
const bcrypt = require("bcrypt");
const { body, validationResult } = require("express-validator");
const { get } = require("mongoose");

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
          is_admin: user.is_admin,
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
    const userId = req.params.id; // Assuming you're passing userId as a route parameter
    const { role } = req.body; // Extract the new role from the request body

    //Input Validation (add more as needed):
    if (!userId || !role) {
      return res.status(400).json({ error: "Missing userId or role" });
    }

    // Find and update the user
    const updatedUser = await User.findByIdAndUpdate(
      userId,
      { role },
      { new: true } //Return updated document
    );

    if (!updatedUser) {
      return res.status(404).json({ message: "User not found" });
    }

    res.json({ message: "User role updated successfully", user: updatedUser });
  } catch (error) {
    console.error("Error updating user role:", error.stack);
    res.status(500).json({ error: "Internal server error" });
  }
};


module.exports = {
  loginUser,
  createUser,
  getUserData,
  getAllUser,
  deleteUser,
  editUser,
  createUserValidation: [
    body("email").isEmail().withMessage("Please provide a valid email address"),
    body("password")
      .isLength({ min: 6 })
      .withMessage("Password must be at least 6 characters long"),
    body("name").notEmpty().withMessage("Name is required"),
  ],
};
