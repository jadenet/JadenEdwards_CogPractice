export type User = {
  user_id: string;
  name: string;
  email: string;
  created_at?: string;
};

export type Account = {
  accountId: string;
  userId: string;
  userName: string;
  balance: number;
};

export type Transaction = {
  type: "DEPOSIT" | "WITHDRAW";
  amount: number;
  date: string;
};
