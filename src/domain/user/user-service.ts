import User from "./user";
import UserRepository from "./user-repository";

export default abstract class UserService {
  userRepository: UserRepository;
  constructor(userRepository: UserRepository) {
    this.userRepository = userRepository;
  }
}
