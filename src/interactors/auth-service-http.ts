import { Request, Response, Router } from "express";
import { v4 as uuidv4 } from "uuid";
import passport = require("passport");
import { Strategy as LocalStrategy } from "passport-local";
import { Strategy as JWTStrategy, ExtractJwt } from "passport-jwt";
const jwt = require("jsonwebtoken");

import UserRepository from "../domain/user-repository";
import ExpressService from "./express-service";
import User from "../domain/user";

const bcrypt = require("bcrypt");

export default class AuthServiceHTTP implements ExpressService {
  router: Router;
  user_repository: UserRepository;
  constructor(user_repository: UserRepository) {
    this.router = Router();
    this.user_repository = user_repository;
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
          passReqToCallback: true,
        },
        async (req, email, password, done) => {
          const user: User | undefined = await this.user_repository.getUserFromEmail(email);

          if (!user) {
            done(null, false, { message: "User not found." });
            return
          }

          const password_hash = user.password
          const valid = this.compare_password(password, password_hash);

          if (!valid) {
            done(null, false, { message: "Invalid Password" });
          }
          done(null, user);
        }
      )
    );
  }

  hash_password(password: string): string {
    const passwordHash = bcrypt.hash(password, 10);
    return passwordHash;
  }
  compare_password(password: string, password_hash: string): boolean {
    const valid = bcrypt.compare(password, password_hash);
    return valid;
  }

  register(request: Request, response: Response) {
    const id = uuidv4().toUpperCase();
    const email = request.params.email;
    const username = request.params.username;
    const password = request.params.password;
    const password_hash = this.hash_password(password);
    this.user_repository.register(
      new User({ id, email, username, password: password_hash })
    );

    if (email && username && password)
      return response.status(200).json({
        success: true,
      });
  }

  login(request: Request, response: Response) {}

  //password.authenticate middleware functions here\
  middleware_jwt() {
    passport.authenticate("jwt");
  }

  register_routes() {
    //password.use in here
    this.router.put("register", this.register.bind);
    this.router.put("login", passport.authenticate("local"), this.login.bind);

    return this.router;
  }
}
