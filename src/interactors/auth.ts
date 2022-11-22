import passport = require("passport");
import { Strategy as LocalStrategy } from "passport-local";
import { Strategy as JWTStrategy, ExtractJwt } from "passport-jwt";
import UserRepositoryPostgress from "../repositories/user/user-repository-postgres";
import User from "../domain/user/user";
import { Response, Router } from "express";
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");

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
      const valid = bcrypt.compare(password, password_hash);

      if (!valid) {
        return done(null, false, { message: "Invalid Password" });
      }
      return done(null, user);
    }
  )
);

const routes = (): Router => {
  const router = Router();

  router.put(
    "/register",
    async (req: Request, res: Response, next: Function) => {
      passport.authenticate("login", async (err, user: User, info) => {
        try {
          if (err || !user) {
            return;
          }

          req.login(user, { session: false }, async (error) => {
            if (error) return next(error);

            const body = {
              id: user.id,
              username: user.username,
              email: user.email,
            };
            const token = jwt.sign(body, process.env.JWT_SECRET);
            return res.json({ token });
          });
        } catch (err) {
          return next(err);
        }
      })(req, res, next);
    }
  );
  //   router.put("/login", this.login);
  //   router.get(
  //     "/verifyIdentity",
  //     passport.authenticate("jwt", { session: false }),
  //     this.verifyIdentity
  //   );

  return router;
};
