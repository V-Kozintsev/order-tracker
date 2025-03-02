// backend/src/server.ts
import express, { Request, Response } from "express";
import cors from "cors";
import { OrdersController } from "../controllers/orders.controller";
import { AdminController } from "../controllers/AdminController";
import { DataSource } from "typeorm";
import { authMiddleware } from "../middleware/authMiddleware";
import { AdminRepository } from "../repositories/AdminRepository"; // Import AdminRepository
const { body, validationResult } = require("express-validator");

import * as dotenv from "dotenv";
dotenv.config();

export async function startServer(dataSource: DataSource) {
  //  Принимаем dataSource как аргумент
  // Keep DataSource argument
  console.log("Server is running!");
  try {
    const app = express();
    const port = 3001;

    app.use(cors());
    app.use(express.json());

    const adminRepository = new AdminRepository(dataSource); // Create AdminRepository instance
    const adminController = new AdminController(dataSource, adminRepository); // Pass AdminRepository to AdminController
    const ordersController = new OrdersController(dataSource); // Pass DataSource to OrdersController

    app.get("/", (req: Request, res: Response) => {
      res.send("Hi backend");
    });

    // Protected route with authMiddleware
    app.post(
      "/orders",
      authMiddleware(dataSource, ["admin", "superadmin"]), // Protect with authMiddleware
      (req: Request, res: Response) => {
        ordersController.createOrder(req, res);
      }
    );

    app.get("/orders/client", (req: Request, res: Response) => {
      ordersController.getOrderByPhoneAndOrderNumber(req, res);
    });

    app.post("/data", (req: Request, res: Response) => {
      const data = req.body;
      res.json(data);
    });

    // **Add this route:**
    app.get(
      "/admin/orders",
      authMiddleware(dataSource, ["admin", "superadmin"]),
      async (req: Request, res: Response) => {
        try {
          const orders = await ordersController.getAllOrders(req, res);
          res.json(orders);
        } catch (error) {
          console.error("Error getting orders:", error);
          res
            .status(500)
            .json({ message: "Не удалось получить список заказов" });
        }
      }
    );

    // Маршруты для администраторов (с защитой и валидацией)
    app.post(
      "/admins",
      [
        body("username")
          .isLength({ min: 3 })
          .withMessage("Username must be at least 3 characters long"),
        body("password")
          .isLength({ min: 6 })
          .withMessage("Password must be at least 6 characters long"),
        body("role").isIn(["admin", "superadmin"]).withMessage("Invalid role"),
      ],
      authMiddleware(dataSource, ["superadmin"]),
      (req: Request, res: Response) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
          return res.status(400).json({ errors: errors.array() });
        }
        return adminController.createAdmin(req, res);
      }
    );
    app.post("/admins/login", (req: Request, res: Response) =>
      adminController.loginAdmin(req, res)
    );
    app.get(
      "/admin",
      authMiddleware(dataSource, ["admin", "superadmin"]),
      (req: Request, res: Response) => {
        // Обработка запроса к админской панели
        res.send("Welcome to the admin panel!");
      }
    );
    app.get("/admins/:id", (req: Request, res: Response) =>
      adminController.getAdmin(req, res)
    );

    app.listen(port, () => {
      console.log(`Сервер запущен на порту ${port}`);
    });
  } catch (error) {
    console.error("Error starting server:", error);
  }
}
