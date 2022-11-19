//require("dotenv").config();
import passport = require("passport");
import { Strategy as localStrategy } from "passport-local";
import { Strategy as JWTStrategy, ExtractJwt } from "passport-jwt";
import { User } from "../entity/user";
import { AppDataSource } from "../data-source";
const bcrypt = require("bcrypt");

//create new user and pass information to next middleware if successful
passport.use(
  "signup",
  new localStrategy(
    {
      usernameField: "email",
      passwordField: "password",
      passReqToCallback: true,
    },
    async (req, email, password, done) => {
      const passwordHash = await bcrypt.hash(password, 10);
      try {
        let user = await AppDataSource.manager.save(
          AppDataSource.manager.create(User, {
            username: req.body.username,
            password: passwordHash,
            email: email,
          })
        );

        // password much be reducted as save doesnt support
        user = { ...user, password: "Redacted" };

        return done(null, user);
      } catch (err) {
        return done(err);
      }
    }
  )
);

// returns errors if password incorrect or user doesnt exist
// returns logged in successfully if successful and passes user information to next middleware
passport.use(
  "login",
  new localStrategy(
    {
      usernameField: "email",
      passwordField: "password",
    },
    async (email: String, password: String, done: Function) => {
      try {
        const user = await AppDataSource.getRepository(User).findOneBy({
          email: String(email),
        });

        if (!user) {
          return done(null, false, { message: "User not found" });
        }

        const validate = await bcrypt.compare(password, user.password);

        if (!validate) {
          return done(null, false, { message: "Wrong Password" });
        }

        return done(
          null,
          { id: user.id, email: user.email, username: user.username },
          { message: "Logged in Successfully" }
        );
      } catch (err) {
        return done(err);
      }
    }
  )
);

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

//https://www.digitalocean.com/community/tutorials/api-authentication-with-json-web-tokensjwt-and-passport
