import store from "../models/inMemoryStore";
import Transaction, { type TransactionType } from "../models/transaction";

class TransactionRepository {
  save(transactionData: { accountId: number; type: TransactionType; amount: number }): Transaction {
    const newTxn = new Transaction({
      txn_id: store.getNextTxnId(),
      account_id: Number(transactionData.accountId),
      txn_type: transactionData.type,
      amount: parseFloat(Number(transactionData.amount).toFixed(2))
    });
    store.transactions.push(newTxn);
    return newTxn;
  }

  findByAccountId(accountId: string | number): Transaction[] {
    return store.transactions.filter(t => t.account_id === Number(accountId));
  }

  deleteByAccountId(accountId: string | number): void {
    for (let index = store.transactions.length - 1; index >= 0; index--) {
      if (store.transactions[index].account_id === Number(accountId)) {
        store.transactions.splice(index, 1);
      }
    }
  }
}

export default new TransactionRepository();