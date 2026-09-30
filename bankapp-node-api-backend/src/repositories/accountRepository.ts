import AccountModel, { toAccountRecord, type AccountRecord } from "../models/account";
import type { ClientSession } from "mongoose";

class AccountRepository {
  async findById(accountId: string, session?: ClientSession): Promise<AccountRecord | null> {
    const query = AccountModel.findById(accountId);
    if (session) query.session(session);
    const account = await query.lean().exec();
    return account ? toAccountRecord(account) : null;
  }

  async save(accountData: { userId: string; accountType: string; balance?: number }): Promise<AccountRecord> {
    const newAccount = await AccountModel.create({
      user_id: accountData.userId,
      balance: accountData.balance ?? 0,
      account_type: accountData.accountType
    });
    return toAccountRecord(newAccount.toObject());
  }

  async update(accountId: string, accountData: { userId?: string; accountType?: string }): Promise<AccountRecord | null> {
    const updates = {
      ...(accountData.userId !== undefined ? { user_id: accountData.userId } : {}),
      ...(accountData.accountType !== undefined ? { account_type: accountData.accountType } : {})
    };
    const account = await AccountModel.findByIdAndUpdate(
      accountId,
      { $set: updates },
      { new: true, runValidators: true }
    ).lean().exec();
    return account ? toAccountRecord(account) : null;
  }

  async delete(accountId: string, session?: ClientSession): Promise<AccountRecord | null> {
    const query = AccountModel.findByIdAndDelete(accountId);
    if (session) query.session(session);
    const account = await query.lean().exec();
    return account ? toAccountRecord(account) : null;
  }

  async adjustBalance(accountId: string, amount: number, session: ClientSession): Promise<AccountRecord | null> {
    const filter = { _id: accountId, ...(amount < 0 ? { balance: { $gte: -amount } } : {}) };
    const account = await AccountModel.findOneAndUpdate(
      filter,
      { $inc: { balance: amount } },
      { new: true, session }
    ).lean().exec();
    return account ? toAccountRecord(account) : null;
  }
}

export default new AccountRepository();