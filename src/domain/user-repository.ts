import User from "./user";

export default interface UserRepository {
  register(user: User): Promise<void>;
  get_from_email(email: string): User;
  to_domain(persistance: any): any;
  to_persistance(domain: any): any;
}
