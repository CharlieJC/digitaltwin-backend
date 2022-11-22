import { Request, Response, Router } from "express";
import { v4 as uuidv4 } from "uuid";

import passport = require("passport");
import { Strategy as LocalStrategy } from "passport-local";
import { Strategy as JWTStrategy, ExtractJwt } from "passport-jwt";
const jwt = require("jsonwebtoken");

import UserRepository from "../domain/user/user-repository";
import ExpressService from "./express-service";
import User from "../domain/user/user";
import UserRepositoryPostgress from "../repositories/user/user-repository-postgres";

const bcrypt = require("bcrypt");

export default class AuthServiceHTTP implements ExpressService {
  router: Router;
  private static _instance: AuthServiceHTTP;
  private constructor() {
    this.router = Router();
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
        },
        async (email, password, done) => {
          const user: User | undefined =
            await UserRepositoryPostgress.instance.getUserFromEmail(email);

          if (!user) {
            return done(null, false, { message: "User not found." });
          }

          const password_hash = user.password;
          const valid = this.compare_password(password, password_hash);

          if (!valid) {
            return done(null, false, { message: "Invalid Password" });
          }
          return done(null, user);
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
    const email = request.body.email;
    const username = request.body.username;
    const password = request.body.password;
    if (!email || !username || !password) {
      return response.status(400).json({
        success: false,
        username: username,
        email: email,
        password: password,
      });
    }

    const password_hash = AuthServiceHTTP.instance.hash_password(password);

    if (password_hash) {
      return response.status(400).json({
        success: false,
        password_hash,
      });
    }

    UserRepositoryPostgress.instance.registerNewUser(
      new User({ id, email, username, password: password_hash })
    );

    return response.status(200).json({
      success: true,
    });
  }

  login(request: Request, response: Response, next: Function) {
    passport.authenticate("local", { session: false }, (err, user, message) => {
      if (err || !user) {
        return next(err);
      }

      const body = {
        id: user.id,
        email: user.email,
        username: user.username,
      };

      const token = jwt.sign(body, process.env.JWT_SECRET);
      return response.json({ token });
    })(response, request, next);
  }

  verifyIdentity(request: Request, response: Response) {
    response.json({
      message: "Token is valid",
      user: request.user,
      token: request.query.secret_token,
    });
  }

  //password.authenticate middleware functions here\
  middleware_jwt() {
    return passport.authenticate("jwt", { session: false });
  }

  register_routes(): Router {
    //password.use in here
    this.router.put("/register", this.register);
    this.router.put("/login", this.login);
    this.router.get(
      "/verifyIdentity",
      passport.authenticate("jwt", { session: false }),
      this.verifyIdentity
    );

    return this.router;
  }

  public static get instance() {
    return this._instance || (this._instance = new this());
  }
}
