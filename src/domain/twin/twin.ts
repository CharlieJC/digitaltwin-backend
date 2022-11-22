export default class Twin {
  id: string;
  ownerId: string;

  constructor({ id, ownerId }: { id: string; ownerId: string }) {
    this.id = id;
    this.ownerId = ownerId;
  }
}
