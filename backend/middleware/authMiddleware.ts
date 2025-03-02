import { Request, Response, NextFunction } from "express";
import { AdminService } from "../services/AdminService";
import { DataSource } from "typeorm";
import * as jwt from "jsonwebtoken";

// Расширяем интерфейс Request, чтобы добавить свойство user
declare global {
  namespace Express {
    interface Request {
      user?: {
        id: number;
        role: string;
        // Другие данные пользователя, если необходимо
      };
    }
  }
}

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
      const secretKey = process.env.JWT_SECRET;
      if (!secretKey) {
        console.error("JWT_SECRET is not defined!");
        return res.status(500).json({ error: "Internal Server Error" }); // Важно не продолжать без секретного ключа
      }

      const decodedToken = jwt.verify(token, secretKey) as jwt.JwtPayload; // Используем JwtPayload

      if (
        !decodedToken ||
        typeof decodedToken === "string" ||
        !decodedToken.adminId ||
        !decodedToken.role
      ) {
        // Если токен невалиден или не содержит adminId/role, возвращаем ошибку
        return res.status(401).json({ error: "Invalid token" });
      }

      const adminId = decodedToken.adminId as number; // Явно приводим тип
      const adminRole = decodedToken.role as string; // Явно приводим тип

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
      req.user = {
        id: admin.id, // или adminId, если у вас id хранится только в decodedToken
        role: admin.role, // или adminRole, если у вас role хранится только в decodedToken
      };

      next();
    } catch (error) {
      console.error(error);
      return res.status(401).json({ error: "Invalid token" });
    }
  };
}
