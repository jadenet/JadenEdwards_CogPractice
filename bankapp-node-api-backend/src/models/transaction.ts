import { model, Schema } from "mongoose";

export type TransactionType = "DEPOSIT" | "WITHDRAW";

export interface TransactionRecord {
  txn_id: number;
  account_id: number;
  txn_type: TransactionType;
  amount: number;
  created_at: Date;
}

const transactionSchema = new Schema<TransactionRecord>({
  txn_id: { type: Number, required: true, unique: true },
  account_id: { type: Number, required: true, index: true },
  txn_type: { type: String, required: true, enum: ["DEPOSIT", "WITHDRAW"] },
  amount: { type: Number, required: true, min: 0 },
  created_at: { type: Date, default: Date.now, immutable: true }
}, { versionKey: false });

export default model<TransactionRecord>("Transaction", transactionSchema);
