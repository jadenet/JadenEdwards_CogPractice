import userRepo from "../repositories/userRepository";

class UserService {
  getAllUsers() {
    return userRepo.findAll();
  }

  getUserById(userId: string | number) {
    const user = userRepo.findById(userId);
    if (!user) {
      throw new Error("User not found");
    }
    return user;
  }

  addUser(userData: { name: string; email: string }) {
    return userRepo.save(userData);
  }

  editUser(userId: string | number, userData: { name?: string; email?: string }) {
    const user = userRepo.update(userId, userData);
    if (!user) {
      throw new Error("User not found");
    }
    return user;
  }

  deleteUser(userId: string | number) {
    const user = userRepo.delete(userId);
    if (!user) {
      throw new Error("User not found");
    }
    return user;
  }
}

export default new UserService();