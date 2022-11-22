import { Router } from "express";
import UserRepository from "../domain/user/user-repository";
import UserService from "../domain/user/user-service";
import ExpressService from "./express-service";

export default class UserServiceHTTP
  extends UserService
  implements ExpressService
{
  router: Router;
  constructor(userRepository: UserRepository, authMiddleware: any) {
    super(userRepository);
    this.router = Router();
  }

  register_routes(): Router {
    throw new Error("Method not implemented.");
  }
}
