// scripts/init_db.ts
import { DataSource, DataSourceOptions } from "typeorm";
import { dataSource } from "../config/dataSource";
import seed from "../seed";

const initDB = async () => {
  try {
    const tempDataSourceOptions: DataSourceOptions = {
      type: "postgres",
      host: process.env.DB_HOST,
      port: Number(process.env.DB_PORT) || 5432,
      username: process.env.DB_USER,
      password: process.env.DB_PASSWORD,
      database: "postgres", 
    };

    const tempDataSource = new DataSource(tempDataSourceOptions);

    // Подключаемся к базе 43
    await tempDataSource.initialize();

    // Проверяем, существует ли база данных
    const dbExists = await tempDataSource.query(
      `SELECT 1 FROM pg_database WHERE datname='${
        process.env.DB_NAME || "order_track"
      }'`
    );

    if (dbExists.length === 0) {
      // Создаем базу данных, если она не существует
      console.log(
        `Creating database ${process.env.DB_NAME || "order_track"}...`
      );
      await tempDataSource.query(
        `CREATE DATABASE "${process.env.DB_NAME || "order_track"}"`
      );
      console.log(
        `Database ${process.env.DB_NAME || "order_track"} created successfully.`
      );
    } else {
      console.log(
        `Database ${process.env.DB_NAME || "order_track"} already exists.`
      );
    }

    // Закрываем временное подключение
    await tempDataSource.destroy();

    // Запускаем миграции для создания таблиц
    console.log("Running migrations...");
    await dataSource.initialize();
    await dataSource.runMigrations();
    console.log("Migrations completed successfully.");
    await seed(dataSource);

    console.log("Database initialization complete.");
  } catch (error) {
    console.error("Database initialization failed:", error);
  }
};

initDB();
