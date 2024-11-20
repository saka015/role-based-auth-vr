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
    required: true,
  },
  password: {
    type: String,
    required: true,
    minlength: 3,
  },
  is_admin: {
    type: Boolean,
    required: true,
  },
});

module.exports = mongoose.model("User", userSchema);
