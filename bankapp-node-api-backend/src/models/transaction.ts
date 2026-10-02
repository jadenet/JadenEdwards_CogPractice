import { model, Schema, Types } from "mongoose";

export type TransactionType = "DEPOSIT" | "WITHDRAW";

export interface TransactionRecord {
  transaction_id: string;
  account_id: string;
  txn_type: TransactionType;
  amount: number;
  created_at: Date;
}

interface TransactionData {
  account_id: Types.ObjectId;
  txn_type: TransactionType;
  amount: number;
  created_at: Date;
}

export function toTransactionRecord(transaction: TransactionData & { _id: Types.ObjectId }): TransactionRecord {
  return {
    transaction_id: transaction._id.toString(),
    account_id: transaction.account_id.toString(),
    txn_type: transaction.txn_type,
    amount: transaction.amount,
    created_at: transaction.created_at
  };
}

const transactionSchema = new Schema<TransactionData>({
  account_id: { type: Schema.Types.ObjectId, ref: "Account", required: true, index: true },
  txn_type: { type: String, required: true, enum: ["DEPOSIT", "WITHDRAW"] },
  amount: { type: Number, required: true, min: 0 },
  created_at: { type: Date, default: Date.now, immutable: true }
}, { versionKey: false });

export default model<TransactionData>("Transaction", transactionSchema);
