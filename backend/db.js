//db.js # Файл для подключения к базе данных
const { Pool } = require("pg");
require("dotenv").config(); // Загружаем переменные окружения из .env

const pool = new Pool({
  user: process.env.DB_USER,
  password: String(process.env.DB_PASSWORD),
  host: process.env.DB_HOST,
  port: process.env.DB_PORT,
  database: process.env.DB_NAME,
});

module.exports = pool;
