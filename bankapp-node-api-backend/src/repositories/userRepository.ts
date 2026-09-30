import UserModel, { toUserRecord, type UserRecord } from "../models/user";

class UserRepository {
  async findAll(): Promise<UserRecord[]> {
    const users = await UserModel.find().sort({ _id: 1 }).lean().exec();
    return users.map(toUserRecord);
  }

  async findById(userId: string): Promise<UserRecord | null> {
    const user = await UserModel.findById(userId).lean().exec();
    return user ? toUserRecord(user) : null;
  }

  async save(userData: { name: string; email: string }): Promise<UserRecord> {
    const user = await UserModel.create({
      name: userData.name,
      email: userData.email
    });
    return toUserRecord(user.toObject());
  }

  async update(userId: string, userData: { name?: string; email?: string }): Promise<UserRecord | null> {
    const user = await UserModel.findByIdAndUpdate(
      userId,
      { $set: userData },
      { new: true, runValidators: true }
    ).lean().exec();
    return user ? toUserRecord(user) : null;
  }

  async delete(userId: string): Promise<UserRecord | null> {
    const user = await UserModel.findByIdAndDelete(userId).lean().exec();
    return user ? toUserRecord(user) : null;
  }
}

export default new UserRepository();