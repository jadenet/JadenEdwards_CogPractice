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

  async deleteByAccountId(accountId: string | string[], session: ClientSession): Promise<void> {
    const filter = Array.isArray(accountId) ? { account_id: { $in: accountId } } : { account_id: accountId };
    await TransactionModel.deleteMany(filter).session(session).exec();
  }

  async findAll(): Promise<TransactionRecord[]> {
    const transactions = await TransactionModel.find().sort({ created_at: -1 }).lean().exec();
    return transactions.map(toTransactionRecord);
  }

  async findById(transactionId: string, session?: ClientSession): Promise<TransactionRecord | null> {
    const query = TransactionModel.findById(transactionId);
    if (session) query.session(session);
    const transaction = await query.lean().exec();
    return transaction ? toTransactionRecord(transaction) : null;
  }

  async update(transactionId: string, data: { type: TransactionType; amount: number }, session: ClientSession): Promise<TransactionRecord | null> {
    const transaction = await TransactionModel.findByIdAndUpdate(
      transactionId,
      { $set: { txn_type: data.type, amount: data.amount } },
      { new: true, runValidators: true, session }
    ).lean().exec();
    return transaction ? toTransactionRecord(transaction) : null;
  }

  async delete(transactionId: string, session: ClientSession): Promise<TransactionRecord | null> {
    const transaction = await TransactionModel.findByIdAndDelete(transactionId).session(session).lean().exec();
    return transaction ? toTransactionRecord(transaction) : null;
  }
}

export default new TransactionRepository();