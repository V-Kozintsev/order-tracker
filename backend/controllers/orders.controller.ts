// backend/controllers/orders.controller.ts
import { Request, Response } from "express";
import { DataSource } from "typeorm"; // Import DataSource
import { Order } from "../entities/Order";
import { validate } from "class-validator";
import { plainToClass } from "class-transformer";

export class OrdersController {
  private orderRepository;

  constructor(private dataSource: DataSource) {
    // Inject DataSource
    this.orderRepository = this.dataSource.getRepository(Order);
  }

  async createOrder(req: Request, res: Response): Promise<void> {
    try {
      // 1. Преобразуем данные из тела запроса в экземпляр класса Order
      const newOrder = plainToClass(Order, req.body);

      // 2. Валидируем данные
      const errors = await validate(newOrder);

      if (errors.length > 0) {
        // Если есть ошибки валидации, отправляем их клиенту
        res.status(400).json({ message: "Ошибка валидации", errors });
        return;
      }

      // 3. Сохраняем заказ в базу данных
      const savedOrder = await this.orderRepository.save(newOrder);

      // 4. Отправляем ответ клиенту
      res.status(201).json(savedOrder);
    } catch (error) {
      console.error("Error creating order:", error);
      res.status(500).json({ message: "Не удалось создать заказ" });
    }
  }

  async getOrder(req: Request, res: Response): Promise<void> {
    try {
      const id = parseInt(req.params.id, 10);

      if (isNaN(id)) {
        res.status(400).json({ message: "Некорректный ID заказа" });
        return;
      }

      const order = await this.orderRepository.findOne({ where: { id } });

      if (order) {
        res.json(order);
      } else {
        res.status(404).json({ message: "Заказ не найден" });
      }
    } catch (error) {
      console.error("Error getting order:", error);
      res.status(500).json({ message: "Не удалось получить заказ" });
    }
  }
}
