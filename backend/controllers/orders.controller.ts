import { Request, Response } from "express";
import { DataSource } from "typeorm";
import { Order } from "../entities/Order";
import { validate } from "class-validator"; // Import validate
import { plainToClass } from "class-transformer"; // Import plainToClass

export class OrdersController {
  private orderRepository;

  constructor(private dataSource: DataSource) {
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

  // ... существующие методы ...

  async getOrderByPhoneAndOrderNumber(
    req: Request,
    res: Response
  ): Promise<void> {
    try {
      const customerPhone = req.query.phone as string;
      const orderNumber = req.query.orderNumber as string;

      console.log("customerPhone:", customerPhone); 
      console.log("orderNumber:", orderNumber); 

      // Валидация параметров
      if (!customerPhone || !orderNumber) {
        res
          .status(400)
          .json({ message: "Не указаны номер телефона и номер заказа" });
        return;
      }

      const order = await this.orderRepository.findOne({
        where: {
          customerPhone: customerPhone,
          orderNumber: orderNumber,
        },
      });

      console.log("order:", order); //  <----  ADD THIS LINE

      if (order) {
        // Форматируем данные для ответа клиенту (выбираем только нужные поля)
        const clientOrderData = {
          orderNumber: order.orderNumber,
          customerPhone: order.customerPhone,
          deliveryAddress: order.deliveryAddress,
          deliveryDate: order.deliveryDate,
          status: order.status,
          items: order.items,
        };

        res.json(clientOrderData);
      } else {
        res.status(404).json({ message: "Заказ не найден" });
      }
    } catch (error) {
      console.error("Error getting order by phone and order number:", error);
      res.status(500).json({ message: "Не удалось получить заказ" });
    }
  }
}
