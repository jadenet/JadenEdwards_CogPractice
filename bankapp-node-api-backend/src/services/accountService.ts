import accountRepo from "../repositories/accountRepository";
import txnRepo from "../repositories/transactionRepository";
import userRepo from "../repositories/userRepository";

class AccountService {
  createAccount(userId: string | number, accountType: string, balance: number) {
    const user = userRepo.findById(userId);
    if (!user) {
      throw new Error("User not found");
    }

    const createdAccount = accountRepo.save({
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

  getAccount(accountId: string | number) {
    const account = accountRepo.findById(accountId);
    if (!account) {
      throw new Error("Account not found");
    }

    const user = userRepo.findById(account.user_id);

    // Formatted to match expected Account Response
    return {
      accountId: account.account_id,
      userName: user ? user.name : "Unknown",
      balance: account.balance
    };
  }

  editAccount(accountId: string | number, accountData: { userId?: string | number; accountType?: string }) {
    const account = accountRepo.findById(accountId);
    if (!account) {
      throw new Error("Account not found");
    }

    let userId: number | undefined;
    if (accountData.userId !== undefined) {
      const user = userRepo.findById(accountData.userId);
      if (!user) {
        throw new Error("User not found");
      }
      userId = user.user_id;
    }

    accountRepo.update(accountId, {
      ...(userId !== undefined ? { userId } : {}),
      ...(accountData.accountType !== undefined ? { accountType: accountData.accountType } : {}),
    });
    return this.getAccount(accountId);
  }

  deleteAccount(accountId: string | number) {
    const accountResponse = this.getAccount(accountId);
    accountRepo.delete(accountId);
    txnRepo.deleteByAccountId(accountId);
    return accountResponse;
  }

  deposit(accountId: string | number, amount: number | string) {
    const numAmount = Number(amount);
    // Rule: Deposit amount must be positive
    if (isNaN(numAmount) || numAmount <= 0) {
      throw new Error("Deposit amount must be positive");
    }

    const account = accountRepo.findById(accountId);
    if (!account) {
      throw new Error("Account not found");
    }

    const newBalance = account.balance + numAmount;
    accountRepo.updateBalance(accountId, newBalance);

    // Rule: Maintain transaction record[cite: 1]
    txnRepo.save({
      accountId: account.account_id,
      type: "DEPOSIT",
      amount: numAmount
    });

    return this.getAccount(accountId);
  }

  withdraw(accountId: string | number, amount: number | string) {
    const numAmount = Number(amount);
    if (isNaN(numAmount) || numAmount <= 0) {
      throw new Error("Withdrawal amount must be positive");
    }

    const account = accountRepo.findById(accountId);
    if (!account) {
      throw new Error("Account not found");
    }

    // Rule: Cannot withdraw more than balance[cite: 1]
    if (account.balance < numAmount) {
      throw new Error("Insufficient funds");
    }

    const newBalance = account.balance - numAmount;
    accountRepo.updateBalance(accountId, newBalance);

    // Rule: Maintain transaction record[cite: 1]
    txnRepo.save({
      accountId: account.account_id,
      type: "WITHDRAW",
      amount: numAmount
    });

    return this.getAccount(accountId);
  }

  getTransactions(accountId: string | number) {
    const account = accountRepo.findById(accountId);
    if (!account) {
      throw new Error("Account not found");
    }

    const history = txnRepo.findByAccountId(accountId);

    // Formatted to match expected Transaction Response[cite: 1]
    return history.map(t => ({
      type: t.txn_type,
      amount: t.amount,
      date: t.created_at.toISOString().split("T")[0]
    }));
  }
}

export default new AccountService();