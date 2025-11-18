import express from "express";
import {
  login,
  refreshToken,
  protectedRoute,
  register,
} from "../controllers/authController.js";

const router = express.Router();

router.post("/login", login);
router.post("/refresh-token", refreshToken);
router.get("/protected", protectedRoute);
router.post("/register", register);

export default router;
