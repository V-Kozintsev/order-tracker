import "reflect-metadata";
import { initializeDatabase } from "./database";
import { startServer } from "./server";

async function main() {
  try {
    await initializeDatabase();
    await startServer();
  } catch (error) {
    console.error("Fatal error:", error);
    process.exit(1);
  }
}
main();
