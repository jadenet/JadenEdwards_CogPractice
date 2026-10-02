import bcrypt from "bcryptjs";
import mongoose from "mongoose";
import type { UserRecord, UserRole } from "../models/user";
import accountRepo from "../repositories/accountRepository";
import txnRepo from "../repositories/transactionRepository";
import userRepo, { type UserWriteData } from "../repositories/userRepository";

export interface UserInput {
  name?: string;
  email?: string;
  username?: string;
  password?: string;
  role?: UserRole;
}

const ADMIN_USERNAME = "admin";
const ADMIN_PASSWORD = "admin";

async function toWriteData({ password, ...rest }: UserInput): Promise<UserWriteData> {
  return {
    ...rest,
    ...(password !== undefined ? { password_hash: await bcrypt.hash(password, 10) } : {})
  };
}

class UserService {
  getAllUsers() {
    return userRepo.findAll();
  }

  async getUserById(userId: string) {
    const user = await userRepo.findById(userId);
    if (!user) {
      throw new Error("User not found");
    }
    return user;
  }

  async addUser(userData: UserInput & { name: string; email: string }) {
    return userRepo.save({ ...await toWriteData(userData), name: userData.name, email: userData.email });
  }

  async editUser(userId: string, userData: UserInput) {
    const user = await userRepo.update(userId, await toWriteData(userData));
    if (!user) {
      throw new Error("User not found");
    }
    return user;
  }

  async deleteUser(userId: string) {
    const user = await this.getUserById(userId);
    const accounts = await accountRepo.findByUserId(userId);
    const session = await mongoose.startSession();
    try {
      await session.withTransaction(async () => {
        await txnRepo.deleteByAccountId(accounts.map((account) => account.account_id), session);
        await accountRepo.deleteByUserId(userId, session);
        await userRepo.delete(userId, session);
      });
    } finally {
      await session.endSession();
    }
    return user;
  }

  async authenticate(username: string, password: string): Promise<UserRecord | null> {
    const found = await userRepo.findCredentialsByUsername(username);
    if (!found?.passwordHash) return null;
    return await bcrypt.compare(password, found.passwordHash) ? found.user : null;
  }

  async ensureAdminUser() {
    const existing = await userRepo.findCredentialsByUsername(ADMIN_USERNAME);
    if (existing) {
      if (existing.user.role !== "admin") await userRepo.update(existing.user.user_id, { role: "admin" });
      return;
    }
    await this.addUser({
      name: "Administrator",
      email: "admin@abcbank.local",
      username: ADMIN_USERNAME,
      password: ADMIN_PASSWORD,
      role: "admin"
    });
    console.log(`Seeded admin user "${ADMIN_USERNAME}"`);
  }
}

export default new UserService();