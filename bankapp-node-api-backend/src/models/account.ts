import { model, Schema, Types } from "mongoose";

export interface AccountRecord {
  account_id: string;
  user_id: string;
  balance: number;
  account_type: string;
  created_at: Date;
}

interface AccountData {
  user_id: Types.ObjectId;
  balance: number;
  account_type: string;
  created_at: Date;
}

export function toAccountRecord(account: AccountData & { _id: Types.ObjectId }): AccountRecord {
  return {
    account_id: account._id.toString(),
    user_id: account.user_id.toString(),
    balance: account.balance,
    account_type: account.account_type,
    created_at: account.created_at
  };
}

const accountSchema = new Schema<AccountData>({
  user_id: { type: Schema.Types.ObjectId, ref: "User", required: true, index: true },
  balance: { type: Number, required: true, default: 0, min: 0 },
  account_type: { type: String, required: true, trim: true },
  created_at: { type: Date, default: Date.now, immutable: true }
}, { versionKey: false });

export default model<AccountData>("Account", accountSchema);
