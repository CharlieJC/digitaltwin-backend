require("dotenv").config();
import { AppDataSource } from "./data-source";
import express = require("express");
import * as bodyParser from "body-parser";
import { Request, Response } from "express";
import { UserRoutes } from "./routes/user-routes";
import cors = require("cors");
import passport = require("passport");
const jwt = require("jsonwebtoken");
require("./auth/auth");

import { User } from "./entity/user";
import { TwinRoutes } from "./routes/twin-routes";

// const httpServer = require("http").createServer();
// const io = require("socket.io")(httpServer, {
//   cors: {
//     origin: "http://localhost:8080",
//   },
// });

AppDataSource.initialize()
  .then(async () => {
    // create express app
    const app = express();
    app.use(bodyParser.json());
    app.use(bodyParser.urlencoded({ extended: false }));
    app.use(cors());

    // register auth routes
    registerAuthRoutes(app);

    // register express routes from defined application routes authenticated with JWT
    registerEntityRoutes(app, UserRoutes, "/api/users");
    registerEntityRoutes(app, TwinRoutes, "/api/twins");

    // setup express app here
    app.get("/", (req: Request, res: Response) => {
      res.send("Welcome to digital twin API");
    });

    // start express server
    app.listen(process.env.PORT);

    console.log(
      `Express server has started on port ${process.env.PORT}. Open http://localhost:${process.env.PORT}/ to see results`
    );
  })
  .catch((error) => console.log(error));

function registerEntityRoutes(app: any, routes: any, routePrefix: string) {
  routes.forEach((route: any) => {
    if (route.auth) {
      (app as any)[route.method](
        routePrefix + route.route,
        passport.authenticate("jwt", { session: false }),
        (req: Request, res: Response, next: Function) => {
          const result = new (route.controller as any)()[route.action](
            req,
            res,
            next
          );
          if (result instanceof Promise) {
            result.then((result) =>
              result !== null && result !== undefined
                ? res.send(result)
                : undefined
            );
          } else if (result !== null && result !== undefined) {
            res.json(result);
          }
        }
      );
    } else {
      (app as any)[route.method](
        routePrefix + route.route,
        (req: Request, res: Response, next: Function) => {
          const result = new (route.controller as any)()[route.action](
            req,
            res,
            next
          );
          if (result instanceof Promise) {
            result.then((result) =>
              result !== null && result !== undefined
                ? res.send(result)
                : undefined
            );
          } else if (result !== null && result !== undefined) {
            res.json(result);
          }
        }
      );
    }
  });
}

function registerAuthRoutes(app: any) {
  //define signup route
  app.post(
    "/api/auth/signup",
    passport.authenticate("signup", { session: false }),
    async (req: Request, res: Response, next: Function) => {
      res.json({
        message: "Signup successful",
        user: req.user,
      });
    }
  );

  //define login route
  app.post(
    "/api/auth/login",
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
            return res.json({ token, body });
          });
        } catch (err) {
          return next(err);
        }
      })(req, res, next);
    }
  );

  app.get(
    "/api/auth/isAuth",
    passport.authenticate("jwt", { session: false }),
    (req: Request, res: Response, next: Function) => {
      res.json({
        message: "You made it to the secure route",
        user: req.user,
        token: req.query.secret_token,
      });
    }
  );
}
