import express from "express";
import cors from "cors";
import authRoutes from "./routes/authroutes.js";

const app = express();
app.use(express.json());
app.use(cors());

const PORT = process.env.PORT || 3000;

// Health Check Route
app.get("/", (req, res) => {
  res.send("JWT Auth Server is running");
});

// Auth Routes
app.use("/", authRoutes);

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
