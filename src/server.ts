import express, { Express, Request, Response, Router } from "express";
import "reflect-metadata";

import dotenv from "dotenv";
dotenv.config();
import "reflect-metadata";
import UserRepositoryPostgress from "./repositories/user/user-repository-postgres";
import AuthServiceHTTP from "./interactors/auth-service-http";
import { PostgresDataSource } from "./repositories/data-source-postgres";
import cors = require("cors");
import * as bodyParser from "body-parser";
import TwinRepositoryPostgress from "./repositories/twin/twin-repository-postgres";
import TwinService from "./domain/twin/twin-service";
import TwinServiceHTTP from "./interactors/twin-service-http";

const port = process.env.PORT;

const app: Express = express();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cors());

//init data sources
PostgresDataSource.initialize()
  .then(() => {
    console.log("Postgres data Source has been initialized!");
  })
  .catch((err) => {
    console.error("Error during Postgres data Source initialization", err);
  });

app.listen(port, () => {
  console.log(`⚡️[server]: Server is running at https://localhost:${port}`);
});

app.get("/", (req: Request, res: Response) => {
  res.send("Digital Twin API");
});

const authRouter: Router = AuthServiceHTTP.instance.register_routes();
const authMiddleware: any = AuthServiceHTTP.instance.middleware_jwt();

const twinRepository = new TwinRepositoryPostgress();
const twinService = new TwinServiceHTTP(twinRepository, authMiddleware);

const twinRouter = twinService.register_routes();

app.use("/api/auth", authRouter);
app.use("/api/twin", twinRouter);

// console.log(authRouter);
// console.log(app._router);
