import User from "./user";
import UserRepository from "./user-repository";

export default abstract class UserService {
  userRepository: UserRepository;
  constructor(userRepository: UserRepository) {
    this.userRepository = userRepository;
  }

  abstract get_user_by_id(id: string): User;
  register_new_user(
    id: string,
    email: string,
    username: string,
    password_hash: string
  ) {
    this.userRepository.register(new User({id, email, username, password: password_hash}));
  }
}
