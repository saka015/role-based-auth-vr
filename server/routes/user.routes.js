// const express = require("express");
// const bodyParser = require("body-parser");
// const multer = require("multer");
// const path = require("path");
// const session = require("express-session");
// const dotenv = require("dotenv");
// const auth = require("../middlewares/auth");

// //
// dotenv.config();
// const userRoute = express.Router();

// // manage session
// userRoute.use(
//   session({
//     secret: process.env.SESSION_SECRET,
//     resave: false,
//     saveUninitialized: true,
//   })
// );

// // parse data
// userRoute.use(bodyParser.json());
// userRoute.use(bodyParser.urlencoded({ extended: true }));

// // multer
// const storage = multer.diskStorage({
//   destination: (req, file, cb) => {
//     cb(null, path.resolve(__dirname, "../public/userImages"));
//   },
//   filename: (req, file, cb) => {
//     cb(null, Date.now() + "-" + file.originalname);
//   },
// });

// const upload = multer({ storage });

// const userController = require("../controllers/user.controller");

// userRoute.post(
//   "/register",
//   auth.isLoggedOut,
//   upload.single("image"),
//   userController.createUser
// );
// userRoute.post("/login", auth.isLoggedIn, userController.loginUser);

// userRoute.get("/about", auth.isLoggedIn,);

// module.exports = userRoute;

const express = require("express");
const bodyParser = require("body-parser");
const multer = require("multer");
const path = require("path");
const session = require("express-session");
const dotenv = require("dotenv");
const auth = require("../middlewares/auth");

dotenv.config();
const userRoute = express.Router();

// Manage session
userRoute.use(
  session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: true,
  })
);

// Parse data
userRoute.use(bodyParser.json());
userRoute.use(bodyParser.urlencoded({ extended: true }));

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
const userController = require("../controllers/user.controller");

// Routes
userRoute.post(
  "/register",
  auth.isLoggedOut,
  upload.single("image"),
  userController.createUser
);

userRoute.post("/login", auth.isLoggedOut, userController.loginUser);
userRoute.use((req, res, next) => {
  console.log("Session Data:", req.session);
  next();
});

userRoute.get("/about", auth.isLoggedIn, (req, res) => {
  res.render("about"); // Example: Render an about page
});

userRoute.get("/logout", auth.isLoggedIn, (req, res) => {
  req.session.destroy((err) => {
    if (err) {
      console.log(err.message);
      return res.status(500).json({
        status: "fail",
        message: "Logout failed. Try again.",
      });
    }
    res.redirect("/login"); // Redirect to login after logout
  });
});

userRoute.get("/check-session", (req, res) => {
  res.json({ session: req.session });
});



module.exports = userRoute;
