import { NextFunction, Request, Response } from "express";
import { User } from "../entity/user";
import { AppDataSource } from "../data-source";

export class UserController {
  private userRepository = AppDataSource.getRepository(User);

  async all(request: Request, response: Response, next: NextFunction) {
    return this.userRepository.find();
  }

  async one(request: Request, response: Response, next: NextFunction) {
    return this.userRepository.findOneBy({ id: request.params.id });
  }

  async save(request: Request, response: Response, next: NextFunction) {
    if (!request.body.email) {
      response.status(400).json("You must pass an email!");
    }
    response.status(201).json({
      message: "User is created!",
      user: this.userRepository.save(request.body),
    });
  }

  async remove(request: Request, response: Response, next: NextFunction) {
    let userToRemove = await this.userRepository.findOneBy({
      id: request.params.id,
    });
    if (userToRemove == null) {
      return;
    }
    await this.userRepository.remove(userToRemove);
    return "success";
  }
}
