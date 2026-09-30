import { model, Schema, Types } from "mongoose";

export interface UserRecord {
  user_id: string;
  name: string;
  email: string;
  created_at: Date;
}

interface UserData {
  name: string;
  email: string;
  created_at: Date;
}

export function toUserRecord(user: UserData & { _id: Types.ObjectId }): UserRecord {
  return {
    user_id: user._id.toString(),
    name: user.name,
    email: user.email,
    created_at: user.created_at
  };
}

const userSchema = new Schema<UserData>({
  name: { type: String, required: true, trim: true },
  email: { type: String, required: true, trim: true, unique: true },
  created_at: { type: Date, default: Date.now, immutable: true }
}, { versionKey: false });

export default model<UserData>("User", userSchema);
