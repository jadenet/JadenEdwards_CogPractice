import TransactionModel, { type TransactionRecord, type TransactionType } from "../models/transaction";
import { nextNumericId } from "../models/counter";
import type { ClientSession } from "mongoose";

class TransactionRepository {
  async save(transactionData: { accountId: number; type: TransactionType; amount: number }, session: ClientSession): Promise<TransactionRecord> {
    const [newTxn] = await TransactionModel.create([{
      txn_id: await nextNumericId("transaction"),
      account_id: Number(transactionData.accountId),
      txn_type: transactionData.type,
      amount: parseFloat(Number(transactionData.amount).toFixed(2))
    }], { session });
    const { _id, ...transactionRecord } = newTxn.toObject();
    return transactionRecord;
  }

  async findByAccountId(accountId: string | number): Promise<TransactionRecord[]> {
    return await TransactionModel.find({ account_id: Number(accountId) })
      .select("-_id").sort({ created_at: 1 }).lean().exec() as TransactionRecord[];
  }

  async deleteByAccountId(accountId: string | number, session: ClientSession): Promise<void> {
    await TransactionModel.deleteMany({ account_id: Number(accountId) }).session(session).exec();
  }
}

export default new TransactionRepository();