import { Request, Response, NextFunction } from "express";
import { AdminService } from "../services/AdminService";
import { DataSource } from "typeorm";
import * as jwt from "jsonwebtoken";

export function authMiddleware(dataSource: DataSource, roles: string[]) {
  return async (req: Request, res: Response, next: NextFunction) => {
    // Получаем токен из заголовка Authorization
    const authHeader = req.headers.authorization;
    const token = authHeader && authHeader.split(" ")[1];

    if (!token) {
      return res.status(401).json({ error: "Unauthorized" });
    }

    try {
      // Проверяем токен с помощью JWT
      const secretKey = process.env.JWT_SECRET || "secret";
      const decodedToken = jwt.verify(token, secretKey) as {
        adminId: number;
        role: string;
      };
      const adminId = decodedToken.adminId;
      const adminRole = decodedToken.role;

      const adminService = new AdminService(dataSource);
      const admin = await adminService.getAdminById(adminId);

      if (!admin) {
        return res.status(401).json({ error: "Unauthorized" });
      }

      // Проверяем роль пользователя
      if (!roles.includes(adminRole)) {
        return res.status(403).json({ error: "Forbidden" });
      }

      // Добавляем пользователя в объект запроса
      (req as any).user = admin;

      next();
    } catch (error) {
      console.error(error);
      return res.status(401).json({ error: "Invalid token" });
    }
  };
}
