import AccountModel, { type AccountRecord } from "../models/account";
import { nextNumericId } from "../models/counter";
import type { ClientSession } from "mongoose";

class AccountRepository {
  async findById(accountId: string | number, session?: ClientSession): Promise<AccountRecord | null> {
    const query = AccountModel.findOne({ account_id: Number(accountId) }).select("-_id");
    if (session) query.session(session);
    return await query.lean().exec() as AccountRecord | null;
  }

  async save(accountData: { userId: number; accountType: string; balance?: number }): Promise<AccountRecord> {
    const newAccount = await AccountModel.create({
      account_id: await nextNumericId("account"),
      user_id: accountData.userId,
      balance: accountData.balance ?? 0,
      account_type: accountData.accountType
    });
    const { _id, ...accountRecord } = newAccount.toObject();
    return accountRecord;
  }

  async update(accountId: string | number, accountData: { userId?: number; accountType?: string }): Promise<AccountRecord | null> {
    const updates = {
      ...(accountData.userId !== undefined ? { user_id: accountData.userId } : {}),
      ...(accountData.accountType !== undefined ? { account_type: accountData.accountType } : {})
    };
    return await AccountModel.findOneAndUpdate(
      { account_id: Number(accountId) },
      { $set: updates },
      { new: true, runValidators: true }
    ).select("-_id").lean().exec() as AccountRecord | null;
  }

  async delete(accountId: string | number, session?: ClientSession): Promise<AccountRecord | null> {
    const query = AccountModel.findOneAndDelete({ account_id: Number(accountId) }).select("-_id");
    if (session) query.session(session);
    return await query.lean().exec() as AccountRecord | null;
  }

  async adjustBalance(accountId: string | number, amount: number, session: ClientSession): Promise<AccountRecord | null> {
    const filter = { account_id: Number(accountId), ...(amount < 0 ? { balance: { $gte: -amount } } : {}) };
    return await AccountModel.findOneAndUpdate(
      filter,
      { $inc: { balance: amount } },
      { new: true, session }
    ).select("-_id").lean().exec() as AccountRecord | null;
  }
}

export default new AccountRepository();