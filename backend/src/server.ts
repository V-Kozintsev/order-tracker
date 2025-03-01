// backend/src/server.ts
import express, { Request, Response } from "express";
import cors from "cors";
import { OrdersController } from "../controllers/orders.controller";
import { AdminController } from "../controllers/AdminController";
import { DataSource } from "typeorm";
import { authMiddleware } from "../middleware/authMiddleware";
const { body, validationResult } = require("express-validator");

export async function startServer(dataSource: DataSource) {
  console.log("Server is running!");
  try {
    const app = express();
    const port = 3000;

    app.use(cors());
    app.use(express.json());

    const ordersController = new OrdersController();
    const adminController = new AdminController(dataSource);

    app.get("/", (req: Request, res: Response) => {
      res.send("Hi backend");
    });

    app.post("/orders", (req: Request, res: Response) => {
      ordersController.createOrder(req, res);
    });

    app.post("/data", (req: Request, res: Response) => {
      const data = req.body;
      res.json(data);
    });

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
