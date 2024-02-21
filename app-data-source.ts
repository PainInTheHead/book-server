import { DataSource } from "typeorm";

const DB_PORT = Number(process.env.DB_PORT)
const DB_PASS = process.env.DB_PASS

export const myDataSource = new DataSource({
    type: "postgres",
    host: "localhost",
    port: DB_PORT || 5432,
    username: "postgres",
    password: DB_PASS || "123456",
    database: "BookServer",
    entities: [__dirname + "/**/*.entity{.ts, .js}"],
    logging: true,
    synchronize: true,
})