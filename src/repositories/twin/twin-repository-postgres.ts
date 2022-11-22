import Twin from "../../domain/twin/twin";
import TwinRepository from "../../domain/twin/twin-repository";
import { PostgresDataSource } from "../data-source-postgres";
import { TwinSchema } from "./twin-schema";

export default class TwinRepositoryPostgress implements TwinRepository {
  //Typeorm user repository
  private twinRepository = PostgresDataSource.getRepository(TwinSchema);

  async createNewTwin(user: Twin): Promise<void> {
    const persistance = this.toPersistance(user);
    await this.twinRepository.save(persistance);
  }
  async getTwinsFromOwner(owner: string): Promise<Twin[] | undefined> {
    const twinSchemas: TwinSchema[] | null = await this.twinRepository.find({
      where: {
        ownerId: owner,
      },
    });
    if (twinSchemas === null) {
      return undefined;
    }
    let twins: Twin[] = [];
    twinSchemas.forEach((schema) => {
      twins.push(this.toDomain(schema));
    });

    return twins;
  }

  async deleteTwinWithId(id: string) {
    const twin = await this.twinRepository.findOneBy({ id });
    if (twin != null) {
      await this.twinRepository.remove(twin);
    }
  }

  toDomain(persistance: TwinSchema): Twin {
    const { id, ownerId } = persistance;
    return new Twin({ id, ownerId: ownerId });
  }
  toPersistance(domain: Twin): TwinSchema {
    const { id, ownerId } = domain;
    return this.twinRepository.create({ id, ownerId: ownerId });
  }
}
