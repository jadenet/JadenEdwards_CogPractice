import store from "../models/inMemoryStore";
import User from "../models/user";

class UserRepository {
  findAll(): User[] {
    return store.users;
  }

  findById(userId: string | number): User | null {
    return store.users.find(user => user.user_id === Number(userId)) || null;
  }

  save(userData: { name: string; email: string }): User {
    const user = new User({
      user_id: store.getNextUserId(),
      name: userData.name,
      email: userData.email
    });
    store.users.push(user);
    return user;
  }

  update(userId: string | number, userData: { name?: string; email?: string }): User | null {
    const user = this.findById(userId);
    if (!user) {
      return null;
    }

    if (userData.name !== undefined) {
      user.name = userData.name;
    }
    if (userData.email !== undefined) {
      user.email = userData.email;
    }
    return user;
  }

  delete(userId: string | number): User | null {
    const index = store.users.findIndex(user => user.user_id === Number(userId));
    if (index === -1) {
      return null;
    }
    return store.users.splice(index, 1)[0];
  }
}

export default new UserRepository();