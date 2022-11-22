import { Request, Router } from "express";
import Twin from "../domain/twin/twin";
import TwinRepository from "../domain/twin/twin-repository";
import TwinService from "../domain/twin/twin-service";
import UserRepository from "../domain/user/user-repository";
import ExpressService from "./express-service";

export default class TwinServiceHTTP
  extends TwinService
  implements ExpressService
{
  router: Router;
  authMiddleware: any;
  userRepository: UserRepository;
  constructor(twinRepository: TwinRepository, authMiddleware: any) {
    super(twinRepository);
    this.router = Router();
    this.authMiddleware = authMiddleware;
  }

  async create(request: Request, response: Response) {
    this.twinRepository.createNewTwin(
      new Twin({ id: request.body.id, ownerId: request.body.ownerId })
    );
  }

  async delete(request: Request, response: Response) {
    this.twinRepository.deleteTwinWithId(request.params.id);
  }

  register_routes(): Router {
    this.router.get("/", this.authMiddleware, this.create.bind);
    this.router.delete("/:id", this.authMiddleware, this.create.bind);

    return this.router;
  }
}
