import mongoose from "mongoose";

export interface User {
  username: string;
  passwordHash: string;
}

const userSchema = new mongoose.Schema<User>({
  username: { type: String, required: true, unique: true },
  passwordHash: { type: String, required: true },
});

export const UserModel = mongoose.model<User>("User", userSchema);
