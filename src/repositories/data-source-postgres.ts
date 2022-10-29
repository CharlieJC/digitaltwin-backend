import "reflect-metadata"
import { DataSource } from "typeorm"
import { UserSchema } from "./user-schema"

export const PostgresDataSource = new DataSource({
    type: "postgres",
    host: process.env.DB_HOST,
    port: Number(process.env.DB_PORT),
    username: process.env.DB_USERNAME,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    synchronize: true,
    logging: false,
    entities: [UserSchema],
    migrations: [],
    subscribers: [],
})