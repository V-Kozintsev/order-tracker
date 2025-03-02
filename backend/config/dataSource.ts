//dataSource.ts
import { DataSource, DataSourceOptions } from "typeorm";

const options: DataSourceOptions = {
  type: "postgres",
  host: process.env.DB_HOST || "localhost",
  port: Number(process.env.DB_PORT) || 5432,
  username: process.env.DB_USER || "order_track_user",
  password: process.env.DB_PASSWORD || "12345",
  database: process.env.DB_NAME || "order_track",
  synchronize: false,
  entities: ["backend/entities/**/*.ts"],
  migrationsTableName: "__migrations",
  migrations: ["backend/migrations/**/*.ts"],
};

export default new DataSource(options);
