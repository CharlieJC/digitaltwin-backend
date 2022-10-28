import { Router } from "express";
import user from "../domain/user";
import UserRepository from "../domain/user-repository";
import UserService from "../domain/user-service";
import ExpressService from "./express-service";

export default class UserServiceHTTP
  extends UserService
  implements ExpressService
{
  router: Router;
  constructor(user_repository: UserRepository) {
    super(user_repository);
    this.router = Router();
  }

  get_user_by_id(id: string): user {
    throw new Error("Method not implemented.");
  }
  register_routes(): void {}
}
