import Twin from "../../domain/twin/twin";
import TwinRepository from "../../domain/twin/twin-repository";
import { PostgresDataSource } from "../data-source-postgres";
import { TwinSchema } from "./twin-schema";

export default class TwinRepositoryPostgress implements TwinRepository {
  //Typeorm user repository
  private twinRepository = PostgresDataSource.getRepository(TwinSchema);

  async createNewTwin(twin: Twin): Promise<Twin | undefined> {
    const found_twin = await this.twinRepository.findOneBy({ id: twin.id });
    if (!found_twin) {
      const persistance = this.toPersistance(twin);
      await this.twinRepository.save(persistance);
      return persistance;
    }

    return undefined;
  }
  async getTwinsFromOwner(owner: string): Promise<Twin[]> {
    const twinSchemas: TwinSchema[] | null = await this.twinRepository.find({
      where: {
        ownerId: owner,
      },
    });
    if (twinSchemas === null) {
      return [];
    }
    let twins: Twin[] = [];
    twinSchemas.forEach((schema) => {
      twins.push(this.toDomain(schema));
    });

    return twins;
  }

  async deleteTwinWithId(
    id: string,
    ownerId: string
  ): Promise<Twin | undefined> {
    const twin = await this.twinRepository.findOneBy({ id });
    if (twin !== null && twin.ownerId === ownerId) {
      await this.twinRepository.remove(twin);
      return this.toDomain(twin);
    }

    return undefined;
  }

  toDomain(persistance: TwinSchema): Twin {
    const { id, ownerId, code } = persistance;
    return new Twin({ id, ownerId: ownerId, code });
  }
  toPersistance(domain: Twin): TwinSchema {
    const { id, ownerId, code } = domain;
    return this.twinRepository.create({ id, ownerId: ownerId, code });
  }
}
