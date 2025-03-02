//database.ts
import { DataSource } from "typeorm";
import { DataSourceOptions } from "typeorm";
import * as dotenv from "dotenv";
dotenv.config();

const config: DataSourceOptions = require("../config/ormconfig.json");

export const AppDataSource = new DataSource(config);

export async function initializeDatabase(): Promise<DataSource> {
  try {
    await AppDataSource.initialize();
    console.log("Data Source has been initialized!");
    return AppDataSource;
  } catch (error) {
    console.error("Error during Data Source initialization:", error);
    throw error;
  }
}
