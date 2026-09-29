export type TransactionType = "DEPOSIT" | "WITHDRAW";

export default class Transaction {
  txn_id: number;
  account_id: number;
  txn_type: TransactionType;
  amount: number;
  created_at: Date;

  constructor({ txn_id, account_id, txn_type, amount, created_at = new Date() }: {
    txn_id: number;
    account_id: number;
    txn_type: TransactionType;
    amount: number;
    created_at?: Date;
  }) {
    this.txn_id = txn_id;
    this.account_id = account_id;
    this.txn_type = txn_type;
    this.amount = amount;
    this.created_at = created_at;
  }
}
