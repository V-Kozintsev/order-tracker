//dataSource.ts
import { DataSource, DataSourceOptions } from "typeorm";

const options: DataSourceOptions = {
  type: "postgres",
  host: "localhost",
  port: 5432,
  username: "order_track_user",
  password: "12345",
  database: "order_track",
  synchronize: false,
  entities: ["backend/entities/**/*.ts"],
  migrationsTableName: "__migrations",
  migrations: ["backend/migrations/**/*.ts"],
};

export default new DataSource(options);
