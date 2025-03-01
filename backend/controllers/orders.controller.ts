import { Request, Response } from "express";
import { AppDataSource, initializeDatabase } from "../src/database";
import { Order } from "../entities/Order";
import { validate } from "class-validator";
import { plainToClass } from "class-transformer";
export class OrdersController {
  async createOrder(req: Request, res: Response): Promise<void> {
    try {
      const orderRepository = AppDataSource.getRepository(Order);

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
      const savedOrder = await orderRepository.save(newOrder);

      // 4. Отправляем ответ клиенту
      res.status(201).json(savedOrder);
    } catch (error) {
      console.error("Error creating order:", error);
      res.status(500).json({ message: "Не удалось создать заказ" });
    }
  }
}
