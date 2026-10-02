import mongoose from "mongoose";
import type { AccountRecord } from "../models/account";
import type { TransactionRecord, TransactionType } from "../models/transaction";
import accountRepo from "../repositories/accountRepository";
import txnRepo from "../repositories/transactionRepository";
import userRepo from "../repositories/userRepository";

function toAccountResponse(account: AccountRecord, userName: string) {
  return {
    accountId: account.account_id,
    userId: account.user_id,
    userName,
    accountType: account.account_type,
    balance: account.balance
  };
}

function toAdminTransaction(t: TransactionRecord) {
  return {
    transactionId: t.transaction_id,
    accountId: t.account_id,
    type: t.txn_type,
    amount: t.amount,
    date: t.created_at.toISOString()
  };
}

function signedAmount(type: TransactionType, amount: number) {
  return type === "DEPOSIT" ? amount : -amount;
}

function parseAmount(amount: number | string, label: string) {
  const rounded = Math.round(Number(amount) * 100) / 100;
  if (!Number.isFinite(rounded) || rounded <= 0) {
    throw new Error(`${label} amount must be positive`);
  }
  return rounded;
}

class AccountService {
  async getAllAccounts() {
    const [accounts, users] = await Promise.all([accountRepo.findAll(), userRepo.findAll()]);
    const names = new Map(users.map((user) => [user.user_id, user.name]));
    return accounts.map((account) => toAccountResponse(account, names.get(account.user_id) ?? "Unknown"));
  }

  async getAccountsForUser(userId: string) {
    const user = await userRepo.findById(userId);
    if (!user) {
      throw new Error("User not found");
    }

    const accounts = await accountRepo.findByUserId(userId);
    return accounts.map((account) => toAccountResponse(account, user.name));
  }

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

    return toAccountResponse(createdAccount, user.name);
  }

  async getAccount(accountId: string) {
    const account = await accountRepo.findById(accountId);
    if (!account) {
      throw new Error("Account not found");
    }

    const user = await userRepo.findById(account.user_id);

    // Formatted to match expected Account Response
    return toAccountResponse(account, user ? user.name : "Unknown");
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

  async deposit(accountId: string, amount: number | string) {
    await this.recordMoneyMovement(accountId, amount, "DEPOSIT");
    return this.getAccount(accountId);
  }

  async withdraw(accountId: string, amount: number | string) {
    await this.recordMoneyMovement(accountId, amount, "WITHDRAW");
    return this.getAccount(accountId);
  }

  private async recordMoneyMovement(accountId: string, amount: number | string, type: TransactionType): Promise<TransactionRecord> {
    const roundedAmount = parseAmount(amount, type === "DEPOSIT" ? "Deposit" : "Withdrawal");
    const delta = signedAmount(type, roundedAmount);
    let saved: TransactionRecord | null = null;
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
        saved = await txnRepo.save({ accountId: account.account_id, type, amount: roundedAmount }, session);
      });
    } finally {
      await session.endSession();
    }
    return saved!;
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
      date: t.created_at.toISOString()
    }));
  }

  async getAllTransactions() {
    return (await txnRepo.findAll()).map(toAdminTransaction);
  }

  async createTransaction(accountId: string, type: TransactionType, amount: number | string) {
    return toAdminTransaction(await this.recordMoneyMovement(accountId, amount, type));
  }

  async editTransaction(transactionId: string, data: { type?: TransactionType; amount?: number | string }) {
    let updated: TransactionRecord | null = null;
    await this.withTransactionSession(transactionId, async (existing, session) => {
      const type = data.type ?? existing.txn_type;
      const amount = data.amount !== undefined ? parseAmount(data.amount, "Transaction") : existing.amount;
      const delta = Math.round((signedAmount(type, amount) - signedAmount(existing.txn_type, existing.amount)) * 100) / 100;
      if (delta !== 0 && !await accountRepo.adjustBalance(existing.account_id, delta, session)) {
        throw new Error("Insufficient funds for this change");
      }
      updated = await txnRepo.update(transactionId, { type, amount }, session);
    });
    return toAdminTransaction(updated!);
  }

  async deleteTransaction(transactionId: string) {
    let deleted: TransactionRecord | null = null;
    await this.withTransactionSession(transactionId, async (existing, session) => {
      const reversal = -signedAmount(existing.txn_type, existing.amount);
      if (!await accountRepo.adjustBalance(existing.account_id, reversal, session)) {
        throw new Error("Insufficient funds to reverse this transaction");
      }
      deleted = await txnRepo.delete(transactionId, session);
    });
    return toAdminTransaction(deleted!);
  }

  private async withTransactionSession(
    transactionId: string,
    work: (existing: TransactionRecord, session: mongoose.ClientSession) => Promise<void>
  ) {
    const session = await mongoose.startSession();
    try {
      await session.withTransaction(async () => {
        const existing = await txnRepo.findById(transactionId, session);
        if (!existing) {
          throw new Error("Transaction not found");
        }
        await work(existing, session);
      });
    } finally {
      await session.endSession();
    }
  }
}

export default new AccountService();