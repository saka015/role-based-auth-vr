import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import cors from "cors";
import userRoute from "./routes/user.routes.js";
import { setupDatabase } from "./db/db.js";
import { seedUser } from "./models/user.model.js";

dotenv.config();

// mongodbConnect();
setupDatabase();
seedUser();

const app = express();
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use("/userImages", express.static("public/userImages"));
app.use("/api", userRoute);

app.listen(5000, () => console.log("✅ Server 5000"));
