import User from "./user";

export default interface UserRepository {
  register(user: User): Promise<void>;
  getUserFromEmail(email: string): Promise<User | undefined>;
  toDomain(persistance: any): User;
  toPersistance(domain: User): any;
}
