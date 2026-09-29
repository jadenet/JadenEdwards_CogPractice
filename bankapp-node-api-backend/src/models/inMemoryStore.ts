// Simulates database tables in memory
import Account from "./account";
import Transaction from "./transaction";
import User from "./user";

const users = [
  new User({ user_id: 1, name: "John Doe", email: "john@example.com" })
];

const accounts: Account[] = [];
const transactions: Transaction[] = [];

let nextAccountId = 1;
let nextTxnId = 1;
let nextUserId = 2;

const inMemoryStore = {
  users,
  accounts,
  transactions,
  getNextUserId: () => nextUserId++,
  getNextAccountId: () => nextAccountId++,
  getNextTxnId: () => nextTxnId++
};

export default inMemoryStore;