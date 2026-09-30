import { model, Schema } from "mongoose";

export interface AccountRecord {
  account_id: number;
  user_id: number;
  balance: number;
  account_type: string;
  created_at: Date;
}

const accountSchema = new Schema<AccountRecord>({
  account_id: { type: Number, required: true, unique: true },
  user_id: { type: Number, required: true, index: true },
  balance: { type: Number, required: true, default: 0, min: 0 },
  account_type: { type: String, required: true, trim: true },
  created_at: { type: Date, default: Date.now, immutable: true }
}, { versionKey: false });

export default model<AccountRecord>("Account", accountSchema);
