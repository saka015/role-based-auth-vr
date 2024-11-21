const express = require("express");
const multer = require("multer");
const path = require("path");
const auth = require("../middlewares/auth");
const userController = require("../controllers/user.controller");

const userRoute = express.Router();

// Multer setup
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, path.resolve(__dirname, "../public/userImages"));
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + "-" + file.originalname);
  },
});

const upload = multer({ storage });

// Routes
userRoute.post(
  "/register",
  auth.isLoggedOut,
  upload.single("image"),
  userController.createUser
);

userRoute.post("/login", auth.isLoggedOut, userController.loginUser);

userRoute.get("/about", auth.isLoggedIn, (req, res) => {
  res.json({ message: "About Page" });
});

//This route is now JWT protected!
// userRoute.get("/getuserdata", userController.getUserData);

userRoute.get("/user", auth.isLoggedIn, userController.getUserData);
userRoute.get("/admin", auth.isLoggedIn, userController.getAllUser);
userRoute.delete(
  "/admin/deleteuser/:id",
  auth.isLoggedIn,
  userController.deleteUser
);

userRoute.put("/admin/edituser/:id", auth.isLoggedIn, userController.editUser);

module.exports = userRoute;
