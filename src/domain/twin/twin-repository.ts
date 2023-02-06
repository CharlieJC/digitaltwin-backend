import Twin from "./twin";

export default interface TwinRepository {
  createNewTwin(twin: Twin): Promise<Twin | undefined>;
  getTwinsFromOwner(owner: string): Promise<Twin[]>;
  deleteTwinWithId(id: string, ownerId: string): Promise<Twin | undefined>;
  toDomain(persistance: any): Twin;
  toPersistance(domain: Twin): any;
}
