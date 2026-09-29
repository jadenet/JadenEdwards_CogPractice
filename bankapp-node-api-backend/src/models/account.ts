export default class Account {
  account_id: number;
  user_id: number;
  balance: number;
  account_type: string;
  created_at: Date;

  constructor({ account_id, user_id, balance = 0, account_type, created_at = new Date() }: {
    account_id: number;
    user_id: number;
    balance?: number;
    account_type: string;
    created_at?: Date;
  }) {
    this.account_id = account_id;
    this.user_id = user_id;
    this.balance = balance;
    this.account_type = account_type;
    this.created_at = created_at;
  }
}
