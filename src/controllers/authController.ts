import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import { users } from "../models/user.js";
import type { User } from "../models/user.ts";
import type { Request, Response } from "express";

const JWT_SECRET = process.env.JWT_SECRET || "supersecret123";
const JWT_REFRESH_TOKEN = process.env.JWT_REFRESH_TOKEN || "refreshsecret123";

export const login = async (req: Request, res: Response) => {
  const { username, password } = req.body;
  const user = users.find((u) => u.username === username);
  if (!user || !(await bcrypt.compare(password, user.passwordHash))) {
    return res.status(401).json({ message: "Invalid credentials" });
  }
  const token = jwt.sign({ id: user.id, username: user.username }, JWT_SECRET, {
    expiresIn: "15m",
  });
  const refreshToken = jwt.sign({ id: user.id }, JWT_REFRESH_TOKEN, {
    expiresIn: "7d",
  });
  res.json({ token, refreshToken });
};

export const refreshToken = (req: Request, res: Response) => {
  const { refreshToken } = req.body;
  if (!refreshToken || typeof refreshToken !== "string") {
    return res.status(400).json({ message: "Refresh token is required" });
  }
  try {
    const payload = jwt.verify(
      refreshToken,
      JWT_REFRESH_TOKEN
    ) as jwt.JwtPayload;
    const user = users.find((u) => u.id === payload.id);
    if (!user) {
      return res.status(401).json({ message: "Invalid refresh token" });
    }
    const newToken = jwt.sign(
      { id: user.id, username: user.username },
      JWT_SECRET,
      { expiresIn: "15m" }
    );
    res.json({ token: newToken });
  } catch (e) {
    return res.status(401).json({ message: "Invalid refresh token" });
  }
};

export const protectedRoute = (req: Request, res: Response) => {
  const authHeader = req.headers.authorization;
  if (!authHeader) {
    return res.status(401).json({ message: "No token provided" });
  }
  const token = authHeader.split(" ")[1];
  if (!token || typeof token !== "string") {
    return res.status(401).json({ message: "Token is missing or invalid" });
  }
  try {
    const payload = jwt.verify(token, JWT_SECRET) as jwt.JwtPayload;
    res.json({
      message: `Hello ${payload.username}, you have accessed a protected route!`,
    });
  } catch (e) {
    return res.status(401).json({ message: "Invalid token" });
  }
};
