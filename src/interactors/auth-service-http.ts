import { Request, Response, Router } from "express";
import { v4 as uuidv4 } from "uuid";

import passport = require("passport");
import { Strategy as LocalStrategy } from "passport-local";
import { Strategy as JWTStrategy, ExtractJwt } from "passport-jwt";
const jwt = require("jsonwebtoken");

import ExpressService from "./express-service";
import User from "../domain/user/user";
import UserRepositoryPostgress from "../repositories/user/user-repository-postgres";

const bcrypt = require("bcrypt");

export default class AuthServiceHTTP implements ExpressService {
  router: Router;
  userRepository: UserRepositoryPostgress;
  constructor(userRepository: UserRepositoryPostgress) {
    this.router = Router();
    this.userRepository = userRepository;
    this.init_passport();
  }

  init_passport() {
    passport.use(
      new JWTStrategy(
        {
          secretOrKey: process.env.JWT_SECRET,
          jwtFromRequest: ExtractJwt.fromUrlQueryParameter("secret_token"),
        },
        async (body, done) => {
          try {
            return done(null, body);
          } catch (error) {
            done(error);
          }
        }
      )
    );

    passport.use(
      new LocalStrategy(
        {
          usernameField: "email",
          passwordField: "password",
          session: false,
        },
        async (email: string, password: string, done: Function) => {
          let user: User | undefined =
            await this.userRepository.getUserFromEmailInclPass(email);
          if (!user || !user.password) {
            return done(null, false, { message: "User not found." });
          }
          const match = await this.compare_password(password, user.password);
          if (!match) {
            return done(null, false, { message: "Invalid password." });
          }

          user = { ...user, password: "Redacted" };
          return done(null, user);
        }
      )
    );
  }

  async hash_password(password: string): Promise<string> {
    const passwordHash = await bcrypt.hash(password, 10);
    return passwordHash;
  }
  async compare_password(
    password: string,
    password_hash: string
  ): Promise<boolean> {
    const valid = await bcrypt.compare(password, password_hash);
    return valid;
  }

  async register(request: Request, response: Response) {
    const email = request.body.email;
    const username = request.body.username;
    const password = request.body.password;

    const email_used = await this.userRepository.getUserFromEmail(email);
    const password_used = await this.userRepository.getUserFromUsername(
      username
    );
    if (email_used || password_used) {
      return response.status(401).send("Unauthorized");
    }

    const id = uuidv4();
    const hashed_password = await this.hash_password(password);
    let user: User = new User({
      id,
      email,
      username,
      password: hashed_password,
    });
    await this.userRepository.registerNewUser(user);
    user = { ...user, password: "Redacted" };

    return response.json({ user });
  }

  login(request: Request, response: Response, next: Function) {
    const token = jwt.sign({ user: request.user }, process.env.JWT_SECRET);
    return response.json({ token, user: request.user });
  }

  verifyIdentity(request: Request, response: Response) {
    response.json(request.user);
  }

  //password.authenticate middleware functions here\
  middleware_jwt() {
    return passport.authenticate("jwt", { session: false });
  }

  register_routes(): Router {
    //password.use in here
    this.router.post("/register", this.register.bind(this));
    this.router.post(
      "/login",
      passport.authenticate("local", { session: false }),
      this.login.bind(this)
    );
    this.router.get(
      "/verifyIdentity",
      passport.authenticate("jwt", { session: false }),
      this.verifyIdentity.bind(this)
    );

    return this.router;
  }
}
