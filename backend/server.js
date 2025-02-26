const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const pool = require("./db"); // Импортируем пул подключений
require("dotenv").config(); // Загружаем переменные окружения из .env

const app = express();
const port = process.env.PORT || 3001; // Используем порт из .env или 3001 по умолчанию

app.use(cors()); // Разрешаем CORS запросы
app.use(bodyParser.json()); // Обрабатываем JSON тела запросов

// Простой маршрут для проверки работоспособности сервера
app.get("/api/test", async (req, res) => {
  try {
    const result = await pool.query("SELECT NOW()"); // Пример запроса к базе данных
    res.json({
      message: "Server is running and connected to PostgreSQL!",
      time: result.rows[0].now,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to connect to PostgreSQL" });
  }
});

// Подключаем маршруты для заказов
const orderRoutes = require("./routes/order"); //  Путь к файлу order.js
app.use("/api/order", orderRoutes);

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
