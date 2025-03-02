//index.ts

import "reflect-metadata";
import dataSource from "../config/dataSource"; // Import your DataSource
import { startServer } from "./server";

async function main() {
  try {
    await dataSource.initialize(); // Initialize DataSource
    console.log("Data Source has been initialized!");

    await startServer(dataSource); // Pass DataSource to startServer
  } catch (error) {
    console.error("Error during Data Source initialization:", error);
  }
}

main();
