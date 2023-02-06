import UserRepository from "../../domain/user/user-repository";
import User from "../../domain/user/user";
import { PostgresDataSource } from "../data-source-postgres";
import { UserSchema } from "./user-schema";

export default class UserRepositoryPostgress implements UserRepository {
  //Typeorm user repository
  private userRespository = PostgresDataSource.getRepository(UserSchema);

  async registerNewUser(user: User): Promise<void> {
    const persistance = this.toPersistance(user);
    await this.userRespository.save(persistance);
  }

  async getUserFromEmail(email: string): Promise<User | undefined> {
    const persistance: UserSchema | null = await this.userRespository.findOne({
      where: { email },
    });
    if (persistance === null) {
      return undefined;
    }
    return this.toDomain(persistance);
  }

  async getUserFromUsername(username: string): Promise<User | undefined> {
    const persistance: UserSchema | null = await this.userRespository.findOne({
      where: { username },
    });
    if (persistance === null) {
      return undefined;
    }
    return this.toDomain(persistance);
  }

  async getUserFromEmailInclPass(email: string): Promise<User | undefined> {
    const persistance: UserSchema | null = await this.userRespository
      .createQueryBuilder("user")
      .where("user.email = :email", { email: String(email) })
      .addSelect("user.password")
      .getOne();
    if (persistance === null) {
      return undefined;
    }
    return this.toDomain(persistance);
  }

  toDomain(persistance: UserSchema): User {
    const { id, email, username, password } = persistance;
    return new User({ id, email, username, password });
  }
  toPersistance(domain: User): UserSchema {
    const { id, email, username, password } = domain;
    return this.userRespository.create({ id, email, username, password });
  }
}
