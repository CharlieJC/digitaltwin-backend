import "reflect-metadata";
import { DataSource } from "typeorm";
import { User } from "./entity/user";
import { Twin } from "./entity/twin";
//require("dotenv").config();

export const AppDataSource = new DataSource({
  type: "postgres",
  host: process.env.DB_HOST,
  port: Number(process.env.DB_PORT),
  username: process.env.DB_USERNAME,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  synchronize: true,
  logging: false,
  entities: [User, Twin],
  migrations: [],
  subscribers: [],
  ssl: process.env.DB_SSL
    ? {
        rejectUnauthorized: false,
      }
    : false,
});
