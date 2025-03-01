import express from "express";
import cors from "cors";
import { OrdersController } from "../controllers/orders.controller";

export async function startServer() {
  console.log("Server is running!");
  try {
    const app = express();
    const port = 3000;

    app.use(cors());
    app.use(express.json());

    const ordersController = new OrdersController();

    app.get("/", (req, res) => {
      res.send("Hi beckend");
    });

    app.post("/orders", (req, res) => {
      ordersController.createOrder(req, res);
    });

    app.post("/data", (req, res) => {
      const data = req.body;

      res.json(data);
    });
    app.listen(port, () => {
      console.log(`Сервер запущен на порту ${port}`);
    });
  } catch (error) {
    console.error("Error starting server:", error);
  }
}
