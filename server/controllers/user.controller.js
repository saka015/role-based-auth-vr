import jwt from "jsonwebtoken";
import { fileURLToPath } from "url";
import User from "../models/user.model.js";
import ejs from "ejs";
import path from "path";

import bcrypt from "bcrypt";
import { body, validationResult } from "express-validator";
import sendMail from "../utils/SendEmail.js";
import { Role, seedRoles } from "../models/role.model.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const hashedPassword = async (password) => {
  const salt = await bcrypt.genSalt(10);
  const hashed = await bcrypt.hash(password, salt);
  return hashed;
};

const createUser = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty())
      return res.status(400).json({ errors: errors.array() });

    const { name, email, password } = req.body;
    const existingUser = await User.findOne({ email });
    if (existingUser)
      return res.status(400).json({ message: "Email already exists" });

    const hashedPasswordValue = await hashedPassword(password);
    const defaultRole = await Role.findOne({ name: "user" });

    const findUserRole = await Role.findOne({ name: "user" });

    const user = new User({
      name,
      email,
      password: hashedPasswordValue,
      role: findUserRole._id,
    });

    const savedUser = await user.save();
    res
      .status(201)
      .json({ message: "User created successfully", user: savedUser });
  } catch (error) {
    console.error("Error creating user:", error);
    res.status(500).json({ message: "Failed to create user" });
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
    const user = await User.findById(userId).populate("role");
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
    await seedRoles();
    const user = await User.find({}).populate("role");
    if (!user) {
      return res
        .status(404)
        .json({ status: "fail", message: "User not found" });
    }
    res.json(user);
    // console.log(user);
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
    const { id: userId } = req.params;
    const { role, status } = req.body;

    // Input Validation
    if (!userId) {
      return res.status(400).json({ error: "Missing userId" });
    }
    if (!role && !status) {
      return res.status(400).json({
        error: "Provide at least one field to update: role or status",
      });
    }

    const updateData = {};
    if (status) updateData.status = status;

    //Handle Role update correctly
    if (role) {
      const roleToUpdate = await Role.findById(role);
      if (!roleToUpdate)
        return res.status(404).json({ message: "Role not found" });
      updateData.role = role;
    }

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

const generateRandomPassword = () => {
  return Math.random().toString(36).slice(-6); // Generates a random 6-character password
};

const adminCreateUser = async (req, res) => {
  try {
    const { name, email, role } = req.body;

    // Validate input
    if (!name || !email || !role) {
      return res.status(400).json({
        status: "fail",
        message: "Name, email, and role are required.",
      });
    }

    // Find the role by ID (this is crucial!)
    const foundRole = await Role.findById(role);
    if (!foundRole) {
      return res.status(400).json({
        status: "fail",
        message: "Invalid role ID provided.",
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

    // Generate a random password (consider a stronger method if needed)
    const temporaryPassword = generateRandomPassword(10); // Generate a 10-character password

    const hashedPassword = await bcrypt.hash(temporaryPassword, 10);

    // Create and save the new user
    const newUser = new User({
      name,
      email,
      password: hashedPassword,
      role: foundRole._id, // Use the ObjectId of the found role
      image: null,
    });

    const savedUser = await newUser.save();

    const emailData = {
      name: name,
      password: temporaryPassword,
    };

    const html = await ejs.renderFile(
      path.join(__dirname, "../mails/temporaryPassword.ejs"),
      emailData
    );

    try {
      await sendMail({
        email: email,
        subject: "Your Account Credentials",
        template: "temporaryPassword.ejs", // Use your EJS template for email
        data: emailData,
      });
    } catch (mailError) {
      console.error("Error sending email:", mailError);
      return res.status(500).json({
        status: "fail",
        message: "Error sending email. Please try again later.",
        error: mailError.message,
      });
    }

    return res.status(201).json({
      status: "success",
      message: "User created successfully! Temporary password sent to email.",
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

const adminAddRole = async (req, res) => {
  try {
    const { name, permissions } = req.body;

    if (!name || !permissions) {
      return res
        .status(400)
        .json({ message: "Role name and permissions are required." });
    }

    const existingRole = await Role.findOne({ name });
    if (existingRole) {
      return res.status(400).json({ message: "Role already exists." });
    }

    const newRole = new Role({ name, permissions });
    await newRole.save();

    return res
      .status(201)
      .json({ message: "Role created successfully!", role: newRole });
  } catch (error) {
    console.error("Error creating role:", error);
    res
      .status(500)
      .json({ message: "Failed to create role. Please try again later." });
  }
};

const getAllRole = async (req, res) => {
  try {
    const role = await Role.find({});
    if (!role) {
      return res
        .status(404)
        .json({ status: "fail", message: "Roles not found" });
    }
    res.json(role);
  } catch (e) {
    res.status(500).json({
      status: "fail",
      message: "Internal server error",
      error: e.message,
    });
  }
};

const editRole = async (req, res) => {
  try {
    const { id: roleId } = req.params;
    const { permissions } = req.body;

    // Input Validation
    if (!roleId) {
      return res.status(400).json({ error: "Missing roleId" });
    }
    if (!permissions) {
      return res.status(400).json({ error: "Permissions object is required" });
    }

    //Find and update the role in database.
    const updatedRole = await Role.findByIdAndUpdate(
      roleId,
      { permissions },
      { new: true }
    );

    if (!updatedRole) {
      return res.status(404).json({ message: "Role not found" });
    }

    return res.json({
      message: "Role updated successfully",
      role: updatedRole,
    });
  } catch (error) {
    console.error("Error updating role:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

const deleteRole = async (req, res) => {
  try {
    const roleId = req.params.id; // Correctly get the role ID

    //Check for valid roleId
    if (!roleId) {
      return res
        .status(400)
        .json({ success: false, message: "Missing RoleId" });
    }
    const deletedRole = await Role.findByIdAndDelete(roleId);

    if (!deletedRole) {
      return res
        .status(404)
        .json({ success: false, message: "Role not found" });
    }

    res
      .status(200)
      .json({ success: true, message: "Role deleted successfully" });
  } catch (error) {
    console.error("Error deleting role:", error.stack);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
};

export default {
  loginUser,
  createUser,
  getUserData,
  getAllUser,
  deleteUser,
  editUser,
  adminCreateUser,
  adminAddRole,
  getAllRole,
  editRole,
  deleteRole,
  createUserValidation: [
    body("email").isEmail().withMessage("Please provide a valid email address"),
    body("password")
      .isLength({ min: 6 })
      .withMessage("Password must be at least 6 characters long"),
    body("name").notEmpty().withMessage("Name is required"),
  ],
};

export const createUserValidation = [
  body("email").isEmail().withMessage("Please provide a valid email address"),
  body("password")
    .isLength({ min: 6 })
    .withMessage("Password must be at least 6 characters long"),
  body("name").notEmpty().withMessage("Name is required"),
];
