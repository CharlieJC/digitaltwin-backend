import TwinRepository from "./twin-repository";

export default abstract class TwinService {
  twinRepository: TwinRepository;
  constructor(twinRepository: TwinRepository) {
    this.twinRepository = twinRepository;
  }
}
