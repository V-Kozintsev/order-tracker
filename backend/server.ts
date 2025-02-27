import "reflect-metadata";
import { DataSource, DataSourceOptions } from "typeorm";
import express from "express";
import { Order } from "./entities/Order";
import dotenv from "dotenv";
import cors from "cors";

dotenv.config();

const app = express();
const port = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

const dataSourceOptions: DataSourceOptions = {
  type: "postgres",
  host: "localhost",
  port: 5432,
  username: "order_tracking_user",
  password: "dnZ3_8vfhdp7LYYldkPQ",
  database: "order_tracking",
  synchronize: true, // ВНИМАНИЕ: Только для разработки!
  logging: false,
  entities: [Order],
  migrations: ["backend/migrations/**/*.ts"],
  subscribers: [],
};

const dataSource = new DataSource(dataSourceOptions);

dataSource
  .initialize()
  .then(async () => {
    console.log("Подключение к базе данных TypeORM установлено!");

    /*
    const order = new Order();
    order.orderNumber = "77777";
    order.customerPhone = "79998887766";
    order.productName = "Чайник";
    order.quantity = 1;
    order.deliveryDate = new Date();
    order.status = "Оформлен";

    await dataSource.manager.save(order);
    console.log("Сохранен новый заказ с id: " + order.id);
    */

    app.get("/", (req, res) => {
      res.send("Привет от бэкенда!");
    });

    app.get("/orders", async (req, res) => {
      const { orderNumber, customerPhone } = req.query;

      if (!orderNumber || !customerPhone) {
        return res.status(400).json({
          error: "Необходимо указать номер заказа и номер телефона клиента.",
        });
      }

      try {
        const orderRepository = dataSource.getRepository(Order);
        const orders = await orderRepository.find({
          where: {
            orderNumber: String(orderNumber), // Преобразуем в строку
            customerPhone: String(customerPhone), // Преобразуем в строку
          },
        });

        if (orders.length === 0) {
          return res.status(404).json({ error: "Заказ не найден." });
        }

        res.json(orders);
      } catch (error) {
        console.error("Ошибка при выполнении запроса к базе данных:", error);
        res.status(500).json({ error: "Ошибка сервера." });
      }
    });

    app.listen(port, () => {
      console.log(`Сервер запущен на порту ${port}`);
    });
  })
  .catch((error) =>
    console.log("Ошибка подключения к базе данных TypeORM: ", error)
  );
