import "dotenv/config";
import express from "express";
import cors from "cors";
import helmet from "helmet";
import rateLimit from "express-rate-limit";
import authRoutes from "./routes/authroutes.js";
import mongoose from "mongoose";

const app = express();

// Security middleware
app.use(helmet());

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // limit each IP to 100 requests per windowMs
  message: "Too many requests from this IP, please try again later.",
});
app.use(limiter);

// CORS configuration
app.use(cors());

app.use(express.json({ limit: "10mb" }));

const PORT = process.env.PORT || 10000;

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
  res.json({
    message: "JWT Auth Server is running smoothly!",
    status: "healthy",
    timestamp: new Date().toISOString(),
  });
});

// Auth Routes
app.use("/api", authRoutes);

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
