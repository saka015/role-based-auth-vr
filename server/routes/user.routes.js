const express = require("express");
const bodyParser = require("body-parser");
const multer = require("multer");
const path = require("path");

const userRoute = express.Router();

userRoute.use(bodyParser.json());
userRoute.use(bodyParser.urlencoded({ extended: true }));

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, path.resolve(__dirname, "../public/userImages"));
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + "-" + file.originalname);
  },
});

const upload = multer({ storage });

const userController = require("../controllers/user.controller");

userRoute.post("/register", upload.single("image"), userController.createUser);
userRoute.post("/login", userController.loginUser);

module.exports = userRoute;
