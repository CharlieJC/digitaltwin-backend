import { NextFunction, Request, Response } from "express";
import { AppDataSource } from "../data-source";
import { Twin } from "../entity/twin";

export class TwinController {
  private twinRepository = AppDataSource.getRepository(Twin);

  async allByOwner(request: Request, response: Response, next: NextFunction) {
    return this.twinRepository.find({
      where: { ownerId: request.body.id },
    });
  }

  async validCode(request: Request, response: Response, next: NextFunction) {
    const twin = await this.twinRepository.find({
      where: { code: Number(request.body.code) },
    });

    if (twin.length >= 1) {
      response.status(200).json({
        twin,
      });
    } else {
      response.status(401);
    }
  }

  async one(request: Request, response: Response, next: NextFunction) {
    // return this.twinRepository.find({
    //   where: {
    //     userID: Number(request.params.user_id),
    //     chatroomID: Number(request.params.chatroom_id),
    //   },
    // });
  }

  async save(request: Request, response: Response, next: NextFunction) {
    const ownerId = request.body.ownerId;
    const code = Math.floor(100000 + Math.random() * 900000);
    return this.twinRepository.save({ ownerId, code });
  }

  async remove(request: Request, response: Response, next: NextFunction) {
    let userToRemove = await this.twinRepository.findOneBy({
      id: request.body.id,
    });
    if (userToRemove == null) {
      return;
    }
    return await this.twinRepository.remove(userToRemove);
  }
}
