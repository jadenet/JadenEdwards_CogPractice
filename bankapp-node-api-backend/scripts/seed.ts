import "dotenv/config";
import bcrypt from "bcryptjs";
import mongoose, { Types } from "mongoose";
import Account from "../src/models/account";
import Transaction, { type TransactionType } from "../src/models/transaction";
import User from "../src/models/user";
import connectDatabase from "../src/utilities/database";

const USER_COUNT = 20;
const SEED_PASSWORD = "password123";
const ACCOUNT_TYPES = ["Everyday", "Savings", "Checking", "Business", "Joint", "Holiday"];

async function resetData() {
  const seededUsers = await User.find({ role: { $ne: "admin" } }, { _id: 1 }).lean();
  const userIds = seededUsers.map((user) => user._id);
  const accountIds = (await Account.find({ user_id: { $in: userIds } }, { _id: 1 }).lean()).map((account) => account._id);
  await Transaction.deleteMany({ account_id: { $in: accountIds } });
  await Account.deleteMany({ _id: { $in: accountIds } });
  await User.deleteMany({ _id: { $in: userIds } });
  console.log(`Removed ${userIds.length} users, ${accountIds.length} accounts and their transactions`);
}

async function seed() {
  // Faker is ESM-only, so it must be loaded dynamically from this CommonJS package.
  const { faker } = await import("@faker-js/faker");
  await connectDatabase();
  if (process.argv.includes("--reset")) await resetData();

  const passwordHash = await bcrypt.hash(SEED_PASSWORD, 10);
  const users = [];
  const accounts = [];
  const transactions = [];

  for (let i = 0; i < USER_COUNT; i += 1) {
    const firstName = faker.person.firstName();
    const lastName = faker.person.lastName();
    const userId = new Types.ObjectId();
    const userCreatedAt = faker.date.past({ years: 2 });
    // Suffix keeps usernames/emails unique across repeated seed runs.
    const suffix = faker.string.alphanumeric({ length: 4, casing: "lower" });
    users.push({
      _id: userId,
      name: `${firstName} ${lastName}`,
      email: faker.internet.email({ firstName, lastName, provider: `${suffix}.example.com` }).toLowerCase(),
      username: faker.internet.username({ firstName, lastName }).replace(/[^a-zA-Z0-9_.-]/g, "").slice(0, 25).toLowerCase() + suffix,
      password_hash: passwordHash,
      role: "user" as const,
      created_at: userCreatedAt
    });

    for (const accountType of faker.helpers.arrayElements(ACCOUNT_TYPES, { min: 1, max: 3 })) {
      const accountId = new Types.ObjectId();
      const accountCreatedAt = faker.date.between({ from: userCreatedAt, to: new Date() });
      const dates = faker.date.betweens({ from: accountCreatedAt, to: new Date(), count: { min: 3, max: 12 } });
      let balanceCents = 0;

      for (const [index, date] of dates.entries()) {
        // First transaction is always an opening deposit so withdrawals have funds to draw from.
        const type: TransactionType = index === 0 || balanceCents < 1000 || faker.datatype.boolean({ probability: 0.55 }) ? "DEPOSIT" : "WITHDRAW";
        const maxCents = type === "DEPOSIT" ? 250000 : Math.min(balanceCents, 80000);
        const amountCents = faker.number.int({ min: 100, max: maxCents });
        balanceCents += type === "DEPOSIT" ? amountCents : -amountCents;
        transactions.push({ account_id: accountId, txn_type: type, amount: amountCents / 100, created_at: date });
      }

      accounts.push({ _id: accountId, user_id: userId, account_type: accountType, balance: balanceCents / 100, created_at: accountCreatedAt });
    }
  }

  await User.insertMany(users);
  await Account.insertMany(accounts);
  await Transaction.insertMany(transactions);

  console.log(`Seeded ${users.length} users, ${accounts.length} accounts, ${transactions.length} transactions`);
  console.log(`All seeded users share the password "${SEED_PASSWORD}". Example username: ${users[0].username}`);
}

seed()
  .catch((error) => {
    console.error("Seeding failed:", error);
    process.exitCode = 1;
  })
  .finally(() => mongoose.disconnect());
