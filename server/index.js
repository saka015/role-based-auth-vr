const express = require("express");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const cors = require("cors");
const userRoute = require("./routes/user.routes");

dotenv.config();

mongoose
.connect(process.env.MONGO_URI)
.then(() => console.log("✅ MongoDB"))
.catch((err) => console.error("❌ MongoDB connection error:", err));

const app = express();
app.use(cors());

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use("/userImages", express.static("public/userImages"));
app.use("/api/users", userRoute);

app.listen(5000, function () {
  console.log("✅ Server 5000");
});
