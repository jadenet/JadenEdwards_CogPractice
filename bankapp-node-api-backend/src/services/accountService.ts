import mongoose from "mongoose";
import accountRepo from "../repositories/accountRepository";
import txnRepo from "../repositories/transactionRepository";
import userRepo from "../repositories/userRepository";

class AccountService {
  async createAccount(userId: string, accountType: string, balance: number) {
    const user = await userRepo.findById(userId);
    if (!user) {
      throw new Error("User not found");
    }

    const createdAccount = await accountRepo.save({
      userId: user.user_id,
      accountType: accountType,
      balance: balance
    });

    return {
      accountId: createdAccount.account_id,
      userName: user.name,
      balance: createdAccount.balance
    };
  }

  async getAccount(accountId: string) {
    const account = await accountRepo.findById(accountId);
    if (!account) {
      throw new Error("Account not found");
    }

    const user = await userRepo.findById(account.user_id);

    // Formatted to match expected Account Response
    return {
      accountId: account.account_id,
      userName: user ? user.name : "Unknown",
      balance: account.balance
    };
  }

  async editAccount(accountId: string, accountData: { userId?: string; accountType?: string }) {
    const account = await accountRepo.findById(accountId);
    if (!account) {
      throw new Error("Account not found");
    }

    let userId: string | undefined;
    if (accountData.userId !== undefined) {
      const user = await userRepo.findById(accountData.userId);
      if (!user) {
        throw new Error("User not found");
      }
      userId = user.user_id;
    }

    await accountRepo.update(accountId, {
      ...(userId !== undefined ? { userId } : {}),
      ...(accountData.accountType !== undefined ? { accountType: accountData.accountType } : {}),
    });
    return this.getAccount(accountId);
  }

  async deleteAccount(accountId: string) {
    const accountResponse = await this.getAccount(accountId);
    const session = await mongoose.startSession();
    try {
      await session.withTransaction(async () => {
        await accountRepo.delete(accountId, session);
        await txnRepo.deleteByAccountId(accountId, session);
      });
    } finally {
      await session.endSession();
    }
    return accountResponse;
  }

  deposit(accountId: string, amount: number | string) {
    return this.recordMoneyMovement(accountId, amount, "DEPOSIT");
  }

  withdraw(accountId: string, amount: number | string) {
    return this.recordMoneyMovement(accountId, amount, "WITHDRAW");
  }

  private async recordMoneyMovement(accountId: string, amount: number | string, type: "DEPOSIT" | "WITHDRAW") {
    const parsedAmount = Number(amount);
    if (!Number.isFinite(parsedAmount) || parsedAmount <= 0) {
      throw new Error(`${type === "DEPOSIT" ? "Deposit" : "Withdrawal"} amount must be positive`);
    }
    const roundedAmount = Math.round(parsedAmount * 100) / 100;
    if (roundedAmount <= 0) {
      throw new Error(`${type === "DEPOSIT" ? "Deposit" : "Withdrawal"} amount must be positive`);
    }

    const delta = type === "DEPOSIT" ? roundedAmount : -roundedAmount;
    const session = await mongoose.startSession();
    try {
      await session.withTransaction(async () => {
        const account = await accountRepo.adjustBalance(accountId, delta, session);
        if (!account) {
          const existing = await accountRepo.findById(accountId, session);
          if (!existing) {
            throw new Error("Account not found");
          }
          throw new Error("Insufficient funds");
        }
        await txnRepo.save({ accountId: account.account_id, type, amount: roundedAmount }, session);
      });
    } finally {
      await session.endSession();
    }
    return this.getAccount(accountId);
  }

  async getTransactions(accountId: string) {
    const account = await accountRepo.findById(accountId);
    if (!account) {
      throw new Error("Account not found");
    }

    const history = await txnRepo.findByAccountId(accountId);

    // Formatted to match expected Transaction Response[cite: 1]
    return history.map(t => ({
      type: t.txn_type,
      amount: t.amount,
      date: t.created_at.toISOString().split("T")[0]
    }));
  }
}

export default new AccountService();