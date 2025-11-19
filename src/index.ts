import "dotenv/config";
import express from "express";
import cors from "cors";
import authRoutes from "./routes/authroutes.js";
import mongoose from "mongoose";

const app = express();
app.use(express.json());
app.use(cors());

const PORT = process.env.PORT || 3000;

// MongoDB Atlas connection
const MONGO_URI = process.env.MONGODB_URI || "";

if (!MONGO_URI) {
  console.error("MongoDB connection string (MONGODB_URI) is not set.");
  process.exit(1);
}

mongoose
  .connect(MONGO_URI)
  .then(() => console.log("Connected to MongoDB Atlas"))
  .catch((err) => {
    console.error("MongoDB connection error:", err);
    process.exit(1);
  });

// Health Check Route
app.get("/", (req, res) => {
  res.send("JWT Auth Server is running");
});

// Auth Routes
app.use("/", authRoutes);

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
