export default class Twin {
  id: string;
  ownerId: string;
  code: number;

  constructor({
    id,
    ownerId,
    code,
  }: {
    id: string;
    ownerId: string;
    code: number;
  }) {
    this.id = id;
    this.ownerId = ownerId;
    this.code = code;
  }
}
