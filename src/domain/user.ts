export default class User {
  id: string;
  email: string;
  username: string;
  password_hash: string;

  constructor({
    id,
    email,
    username,
    password_hash,
  }: {
    id: string;
    email: string;
    username: string;
    password_hash: string;
  }) {
    this.id = id;
    this.email = email;
    this.username = username;
    this.password_hash = password_hash;
  }
}

// https://acidtango.com/thelemoncrunch/using-null-object-pattern-to-avoid-over-fetching-in-ddd/
