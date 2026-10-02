export type User = {
  user_id: string;
  name: string;
  email: string;
  username?: string;
  role?: "user" | "admin";
  created_at?: string;
};

export type Account = {
  accountId: string;
  userId: string;
  userName: string;
  accountType?: string;
  balance: number;
};

export type Transaction = {
  type: "DEPOSIT" | "WITHDRAW";
  amount: number;
  date: string;
};

export type AdminTransaction = Transaction & {
  transactionId: string;
  accountId: string;
};

export type AuthResponse = {
  token: string;
  user: User;
};
