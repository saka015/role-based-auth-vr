import express from "express";
import multer from "multer";
import path from "path";
import auth from "../middlewares/auth.js";
import userController from "../controllers/user.controller.js";

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
userRoute.post(
  "/admin/createuser",
  auth.isLoggedIn,
  userController.adminCreateUser
);

userRoute.put("/admin/edituser/:id", auth.isLoggedIn, userController.editUser);
userRoute.post("/admin/addrole", auth.isLoggedIn, userController.adminAddRole);
userRoute.get(
  "/admin/getallroles",
  auth.isLoggedIn,
  userController.getAllRole
);
userRoute.put("/admin/editrole/:id", auth.isLoggedIn, userController.editRole);
userRoute.delete(
  "/admin/deleterole/:id",
  auth.isLoggedIn,
  userController.deleteRole
);



// module.exports = userRoute;
export default userRoute;
