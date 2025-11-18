import express from "express";
import {
  login,
  refreshToken,
  protectedRoute,
} from "../controllers/authController.js";

const router = express.Router();

router.post("/login", login);
router.post("/refresh-token", refreshToken);
router.get("/protected", protectedRoute);

export default router;
