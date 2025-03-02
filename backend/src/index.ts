//index.ts
import "reflect-metadata";
import { initializeDatabase } from "./database";
import { startServer } from "./server";
import { DataSource } from "typeorm"; // Импортируем DataSource

async function main() {
  try {
    const dataSource: DataSource = await initializeDatabase(); // Получаем DataSource
    await startServer(dataSource); // Передаем DataSource в startServer
  } catch (error) {
    console.error("Fatal error:", error);
    process.exit(1);
  }
}
main();
