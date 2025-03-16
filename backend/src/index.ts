//index.ts
// index.ts
import "reflect-metadata";
import {dataSource} from "../config/dataSource";
import { startServer } from "./server";
import seed from "../seed";

async function main() {
  try {
    await dataSource.initialize();
    console.log("Data Source has been initialized!");

    await seed(dataSource); // Execute the seed function

    await startServer(dataSource);
  } catch (error) {
    console.error("Error during Data Source initialization:", error);
  }
}

main();
