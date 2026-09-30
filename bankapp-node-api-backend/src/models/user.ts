import { model, Schema } from "mongoose";

export interface UserRecord {
  user_id: number;
  name: string;
  email: string;
  created_at: Date;
}

const userSchema = new Schema<UserRecord>({
  user_id: { type: Number, required: true, unique: true },
  name: { type: String, required: true, trim: true },
  email: { type: String, required: true, trim: true, unique: true },
  created_at: { type: Date, default: Date.now, immutable: true }
}, { versionKey: false });

export default model<UserRecord>("User", userSchema);
