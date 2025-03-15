import { Request, Response } from "express";
import { DataSource } from "typeorm";
import { Order } from "../entities/Order";
import { validate } from "class-validator";
import { plainToClass } from "class-transformer";

export class OrdersController {
  private orderRepository;

  constructor(private dataSource: DataSource) {
    this.orderRepository = this.dataSource.getRepository(Order);
  }

  async createOrder(req: Request, res: Response): Promise<void> {
    try {
      console.log("createOrder: request body:", req.body); //  Логируем тело запроса

      const newOrder = plainToClass(Order, req.body);
      console.log("createOrder: newOrder after plainToClass:", newOrder); //  Логируем newOrder после plainToClass

      const errors = await validate(newOrder);
      console.log("createOrder: validation errors:", errors); //  Логируем ошибки валидации

      if (errors.length > 0) {
        res.status(400).json({ message: "Ошибка валидации", errors });
        return;
      }

      const savedOrder = await this.orderRepository.save(newOrder);
      console.log("createOrder: savedOrder:", savedOrder); //  Логируем savedOrder после сохранения

      res.status(201).json(savedOrder);
    } catch (error) {
      console.error("Error creating order:", error);
      res.status(500).json({ message: "Не удалось создать заказ" });
    }
  }

  async getOrderByPhoneAndOrderNumber(
    req: Request,
    res: Response
  ): Promise<void> {
    try {
      const customerPhone = req.query.phone as string;
      const orderNumber = req.query.orderNumber as string;

      console.log("customerPhone:", customerPhone);
      console.log("orderNumber:", orderNumber);

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

      console.log("order:", order);

      if (order) {
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

  // **Add this method:**
  async getAllOrders(): Promise<Order[]> {
    try {
      return await this.orderRepository.find();
    } catch (error) {
      throw new Error("Не удалось получить список заказов");
    }
  }

  async getOrderById(req: Request, res: Response): Promise<void> {
    try {
      const orderId = parseInt(req.params.id);
      const order = await this.orderRepository.findOne({
        where: { id: orderId },
      });

      if (!order) {
        res.status(404).json({ message: "Заказ не найден" });
        return;
      }

      res.json(order);
    } catch (error) {
      console.error("Error getting order by ID:", error);
      res.status(500).json({ message: "Ошибка получения заказа" });
    }
  }

  async updateOrder(req: Request, res: Response): Promise<void> {
    try {
      const orderId = parseInt(req.params.id);
      const existingOrder = await this.orderRepository.findOneBy({
        id: orderId,
      });

      if (!existingOrder) {
        res.status(404).json({ message: "Заказ не найден" });
        return;
      }

      const updatedData = plainToClass(Order, req.body);
      const errors = await validate(updatedData);

      if (errors.length > 0) {
        res.status(400).json({ message: "Ошибка валидации", errors });
        return;
      }

      const mergedOrder = this.orderRepository.merge(
        existingOrder,
        updatedData
      );
      const savedOrder = await this.orderRepository.save(mergedOrder);

      res.json(savedOrder);
    } catch (error) {
      console.error("Error updating order:", error);
      res.status(500).json({ message: "Ошибка обновления заказа" });
    }
  }

  async deleteOrder(req: Request, res: Response): Promise<void> {
    try {
      const orderId = parseInt(req.params.id);
      await this.orderRepository.delete(orderId);

      res.status(204).json({ message: "Заказ удален" });
    } catch (error) {
      console.error("Error deleting order:", error);
      res.status(500).json({ message: "Ошибка удаления заказа" });
    }
  }
}
