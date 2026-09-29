import Account from "../models/account";
import store from "../models/inMemoryStore";

class AccountRepository {
  findById(accountId: string | number): Account | null {
    return store.accounts.find(a => a.account_id === Number(accountId)) || null;
  }

  save(accountData: { userId: number; accountType: string; balance?: number }): Account {
    const newAccount = new Account({
      account_id: store.getNextAccountId(),
      user_id: accountData.userId,
      balance: accountData.balance || 0.00,
      account_type: accountData.accountType
    });
    store.accounts.push(newAccount);
    return newAccount;
  }

  update(accountId: string | number, accountData: { userId?: number; accountType?: string }): Account | null {
    const account = this.findById(accountId);
    if (!account) {
      return null;
    }

    if (accountData.userId !== undefined) {
      account.user_id = accountData.userId;
    }
    if (accountData.accountType !== undefined) {
      account.account_type = accountData.accountType;
    }
    return account;
  }

  delete(accountId: string | number): Account | null {
    const index = store.accounts.findIndex(account => account.account_id === Number(accountId));
    if (index === -1) {
      return null;
    }
    return store.accounts.splice(index, 1)[0];
  }

  updateBalance(accountId: string | number, newBalance: number): Account | null {
    const account = this.findById(accountId);
    if (account) {
      account.balance = parseFloat(newBalance.toFixed(2));
    }
    return account;
  }
}

export default new AccountRepository();