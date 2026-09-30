import UserModel, { type UserRecord } from "../models/user";
import { nextNumericId } from "../models/counter";

class UserRepository {
  async findAll(): Promise<UserRecord[]> {
    return await UserModel.find().select("-_id").sort({ user_id: 1 }).lean().exec() as UserRecord[];
  }

  async findById(userId: string | number): Promise<UserRecord | null> {
    return await UserModel.findOne({ user_id: Number(userId) }).select("-_id").lean().exec() as UserRecord | null;
  }

  async save(userData: { name: string; email: string }): Promise<UserRecord> {
    const user = await UserModel.create({
      user_id: await nextNumericId("user"),
      name: userData.name,
      email: userData.email
    });
    const { _id, ...userRecord } = user.toObject();
    return userRecord;
  }

  async update(userId: string | number, userData: { name?: string; email?: string }): Promise<UserRecord | null> {
    return await UserModel.findOneAndUpdate(
      { user_id: Number(userId) },
      { $set: userData },
      { new: true, runValidators: true }
    ).select("-_id").lean().exec() as UserRecord | null;
  }

  async delete(userId: string | number): Promise<UserRecord | null> {
    return await UserModel.findOneAndDelete({ user_id: Number(userId) })
      .select("-_id").lean().exec() as UserRecord | null;
  }
}

export default new UserRepository();