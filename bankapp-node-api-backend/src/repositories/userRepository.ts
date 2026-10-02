import UserModel, { toUserRecord, type UserRecord, type UserRole } from "../models/user";
import type { ClientSession } from "mongoose";

export interface UserWriteData {
  name?: string;
  email?: string;
  username?: string;
  password_hash?: string;
  role?: UserRole;
}

class UserRepository {
  async findCredentialsByUsername(username: string): Promise<{ user: UserRecord; passwordHash?: string } | null> {
    const user = await UserModel.findOne({ username: username.trim().toLowerCase() })
      .select("+password_hash").lean().exec();
    return user ? { user: toUserRecord(user), passwordHash: user.password_hash } : null;
  }

  async findAll(): Promise<UserRecord[]> {
    const users = await UserModel.find().sort({ _id: 1 }).lean().exec();
    return users.map(toUserRecord);
  }

  async findById(userId: string): Promise<UserRecord | null> {
    const user = await UserModel.findById(userId).lean().exec();
    return user ? toUserRecord(user) : null;
  }

  async save(userData: UserWriteData & { name: string; email: string }): Promise<UserRecord> {
    const user = await UserModel.create(userData);
    return toUserRecord(user.toObject());
  }

  async update(userId: string, userData: UserWriteData): Promise<UserRecord | null> {
    const user = await UserModel.findByIdAndUpdate(
      userId,
      { $set: userData },
      { new: true, runValidators: true }
    ).lean().exec();
    return user ? toUserRecord(user) : null;
  }

  async delete(userId: string, session?: ClientSession): Promise<UserRecord | null> {
    const query = UserModel.findByIdAndDelete(userId);
    if (session) query.session(session);
    const user = await query.lean().exec();
    return user ? toUserRecord(user) : null;
  }
}

export default new UserRepository();