// dataSource.ts
import { DataSource, DataSourceOptions } from "typeorm";
import * as dotenv from "dotenv";
import * as dotenvExpand from "dotenv-expand";

dotenvExpand.expand(dotenv.config());

const options: DataSourceOptions = {
  type: "postgres",
  host: process.env.DB_HOST || "localhost",
  port: Number(process.env.DB_PORT) || 5432,
  username: process.env.DB_USER || "order_track_user",
  password: process.env.DB_PASSWORD || "12345",
  database: process.env.DB_NAME || "order_track",
  synchronize: true, // Важно: в production должно быть false
  entities: [__dirname + "/../entities/**/*.ts"],
  migrationsTableName: "__migrations",
  migrations: [__dirname + "/../migrations/**/*.ts"],
};

export const dataSource = new DataSource(options);
