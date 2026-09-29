export default class User {
  user_id: number;
  name: string;
  email: string;
  created_at: Date;

  constructor({
    user_id,
    name,
    email,
    created_at = new Date(),
  }: {
    user_id: number;
    name: string;
    email: string;
    created_at?: Date;
  }) {
    this.user_id = user_id;
    this.name = name;
    this.email = email;
    this.created_at = created_at;
  }
}
