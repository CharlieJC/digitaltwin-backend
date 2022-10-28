import UserRepository from "../domain/user-repository";
import User from "../domain/user";

export default class UserRepositoryPostgress implements UserRepository {
  register(user: User): Promise<void> {
    throw new Error("Method not implemented.");
  }
  get_from_email(email: string): User {
    throw new Error("Method not implemented.");
  }
  to_domain(persistance: any) {
    throw new Error("Method not implemented.");
  }
  to_persistance(domain: any) {
    throw new Error("Method not implemented.");
  }
}
