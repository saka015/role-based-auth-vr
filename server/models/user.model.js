import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  image: {
    type: String,
    required: false,
  },
  status: {
    type: String,
    enum: ["active", "inactive"],
    default: "active",
  },
  password: {
    type: String,
    required: true,
    minlength: 3,
  },
  role: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Role",
    default: null,
  },
});

const User = mongoose.model("User", userSchema);
export default User;

import bcrypt from "bcrypt";
import { Role } from "./role.model.js";
export const seedUser = async () => {
  try {
    const existingUser = await User.findOne({ email: "admin@gmail.com" });

    const findAdmin = await Role.findOne({ name: "admin" });

    if (!existingUser) {
      const hashedPassword = await bcrypt.hash("admin@123", 10);
      const user = new User({
        name: "Admin",
        email: "admin@gmail.com",
        password: hashedPassword,
        role: findAdmin._id,
      });
      await user.save();
      console.log("Seeded user: Admin");
    }
  } catch (error) {
    console.error("Error seeding user:", error);
  }
};
