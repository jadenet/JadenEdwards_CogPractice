import userRepo from "../repositories/userRepository";

class UserService {
  getAllUsers() {
    return userRepo.findAll();
  }

  async getUserById(userId: string | number) {
    const user = await userRepo.findById(userId);
    if (!user) {
      throw new Error("User not found");
    }
    return user;
  }

  addUser(userData: { name: string; email: string }) {
    return userRepo.save(userData);
  }

  async editUser(userId: string | number, userData: { name?: string; email?: string }) {
    const user = await userRepo.update(userId, userData);
    if (!user) {
      throw new Error("User not found");
    }
    return user;
  }

  async deleteUser(userId: string | number) {
    const user = await userRepo.delete(userId);
    if (!user) {
      throw new Error("User not found");
    }
    return user;
  }
}

export default new UserService();