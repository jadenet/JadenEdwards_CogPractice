import { model, Schema, Types } from "mongoose";

export type UserRole = "user" | "admin";

export interface UserRecord {
  user_id: string;
  name: string;
  email: string;
  username?: string;
  role: UserRole;
  created_at: Date;
}

export interface UserData {
  name: string;
  email: string;
  username?: string;
  password_hash?: string;
  role: UserRole;
  created_at: Date;
}

export function toUserRecord(user: Omit<UserData, "password_hash"> & { _id: Types.ObjectId }): UserRecord {
  return {
    user_id: user._id.toString(),
    name: user.name,
    email: user.email,
    username: user.username,
    role: user.role ?? "user",
    created_at: user.created_at
  };
}

const userSchema = new Schema<UserData>({
  name: { type: String, required: true, trim: true },
  email: { type: String, required: true, trim: true, unique: true },
  username: { type: String, trim: true, lowercase: true, unique: true, sparse: true },
  password_hash: { type: String, select: false },
  role: { type: String, enum: ["user", "admin"], default: "user" },
  created_at: { type: Date, default: Date.now, immutable: true }
}, { versionKey: false });

export default model<UserData>("User", userSchema);
