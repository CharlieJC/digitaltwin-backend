export default class User {
  id: string;
  email: string;
  username: string;
  password: string;

  constructor({
    id,
    email,
    username,
    password,
  }: {
    id: string;
    email: string;
    username: string;
    password: string;
  }) {
    this.id = id;
    this.email = email;
    this.username = username;
    this.password = password;
  }
}

// https://acidtango.com/thelemoncrunch/using-null-object-pattern-to-avoid-over-fetching-in-ddd/
