const mongoose = require("mongoose");

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
    type: String,
    enum: ["user", "admin", "maintainer"],
    default: "user",
  },
});

module.exports = mongoose.model("User", userSchema);
