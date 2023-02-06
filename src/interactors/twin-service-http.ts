import { Response, Request, Router } from "express";
import Twin from "../domain/twin/twin";
import TwinRepository from "../domain/twin/twin-repository";
import TwinService from "../domain/twin/twin-service";
import UserRepository from "../domain/user/user-repository";
import ExpressService from "./express-service";
import { v4 as uuidv4 } from "uuid";
import User from "../domain/user/user";
type AuthUserType = {
  user: User;
  iat: number;
};
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
    const id: string = uuidv4();
    const code = Math.floor(100000 + Math.random() * 900000);
    const twin: Twin = new Twin({ id, ownerId: request.body.ownerId, code });
    const created = await this.twinRepository.createNewTwin(twin);
    return response.json({ twin: created });
  }

  async delete(request: Request, response: Response) {
    const auth_user = request.user as AuthUserType;
    const user = auth_user.user;
    if (!user) {
      return response.status(401).send("Unauthorized");
    }
    const ownerId = user.id;
    const twin: Twin | undefined = await this.twinRepository.deleteTwinWithId(
      request.body.id,
      ownerId
    );
    return response.json({ twin });
  }

  async allByOwner(request: Request, response: Response) {
    const twins: Twin[] = await this.twinRepository.getTwinsFromOwner(
      request.body.id
    );
    return response.json({ twins });
  }

  async validCode(request: Request, response: Response) {
    // this.twinRepository.deleteTwinWithId(request.params.id);
    //TODO
    return response.json({ valid: true });
  }
  register_routes(): Router {
    this.router.post("/", this.authMiddleware, this.create.bind(this));
    this.router.delete("/:id", this.authMiddleware, this.delete.bind(this));
    this.router.post(
      "/allByOwner",
      this.authMiddleware,
      this.allByOwner.bind(this)
    );

    this.router.post(
      "validCode",
      this.authMiddleware,
      this.validCode.bind(this)
    );

    return this.router;
  }
}
