import User from "../user/user";
import Twin from "./twin";

export default interface TwinRepository {
  createNewTwin(user: Twin): Promise<void>;
  getTwinsFromOwner(email: string): Promise<Twin[] | undefined>;
  deleteTwinWithId(id: string): Promise<void>;
  toDomain(persistance: any): Twin;
  toPersistance(domain: Twin): any;
}
