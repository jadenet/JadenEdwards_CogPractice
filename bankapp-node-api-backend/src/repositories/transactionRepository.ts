import TransactionModel, { toTransactionRecord, type TransactionRecord, type TransactionType } from "../models/transaction";
import type { ClientSession } from "mongoose";

class TransactionRepository {
  async save(transactionData: { accountId: string; type: TransactionType; amount: number }, session: ClientSession): Promise<TransactionRecord> {
    const [newTxn] = await TransactionModel.create([{
      account_id: transactionData.accountId,
      txn_type: transactionData.type,
      amount: parseFloat(Number(transactionData.amount).toFixed(2))
    }], { session });
    return toTransactionRecord(newTxn.toObject());
  }

  async findByAccountId(accountId: string): Promise<TransactionRecord[]> {
    const transactions = await TransactionModel.find({ account_id: accountId })
      .sort({ created_at: 1 }).lean().exec();
    return transactions.map(toTransactionRecord);
  }

  async deleteByAccountId(accountId: string, session: ClientSession): Promise<void> {
    await TransactionModel.deleteMany({ account_id: accountId }).session(session).exec();
  }
}

export default new TransactionRepository();