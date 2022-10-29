import UserRepository from "../domain/user-repository";
import User from "../domain/user";
import { PostgresDataSource } from "./data-source-postgres";
import { UserSchema } from "./user-schema";

export default class UserRepositoryPostgress implements UserRepository {

  //Typeorm user repository
  private userRespository = PostgresDataSource.getRepository(UserSchema)

  async register(user: User): Promise<void> {
    const persistance = this.toPersistance(user)
    await this.userRespository.save(persistance)
  }
  async getUserFromEmail(email: string): Promise<User|undefined> {
    const persistance: UserSchema | null = await this.userRespository.findOneBy({email})
    if (persistance === null) {
      return undefined
    }
    return this.toDomain(persistance)
  }
  toDomain(persistance: UserSchema): User {
    const {id, email, username, password} = persistance
    return new User({id, email, username, password})
  }
  toPersistance(domain: User): UserSchema {
    const {id, email, username, password} = domain
    return this.userRespository.create({id, email, username,password})
  }
}
