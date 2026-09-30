export type Page =
  | "home"
  | "users"
  | "create-user"
  | "accounts"
  | "create-account"
  | "account-details"
  | "deposit"
  | "withdraw"
  | "transactions"
  | "about"
  | "contact"
  | "data";

export type User = {
  user_id: string;
  name: string;
  email: string;
  created_at?: string;
};

export type Account = {
  accountId: string;
  userName: string;
  balance: number;
};

export type Transaction = {
  type: "DEPOSIT" | "WITHDRAW";
  amount: number;
  date: string;
};

export type NavigationLink = {
  id: Page;
  label: string;
};
