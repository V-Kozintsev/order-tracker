import { Request, Response, NextFunction } from "express";
import { AdminService } from "../services/AdminService";
import { DataSource } from "typeorm";
import * as jwt from "jsonwebtoken";
import { AdminRepository } from "../repositories/AdminRepository"; // Import AdminRepository

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
    console.log("authMiddleware: start");
    const authHeader = req.headers.authorization;
    const token = authHeader && authHeader.split(" ")[1];

    if (!token) {
      console.log("authMiddleware: no token provided");
      return res.status(401).json({ error: "Unauthorized" });
    }

    try {
      const secretKey = process.env.JWT_SECRET;
      if (!secretKey) {
        console.error("authMiddleware: JWT_SECRET is not defined!");
        return res.status(500).json({ error: "Internal Server Error" });
      }

      const decodedToken = jwt.verify(token, secretKey) as jwt.JwtPayload;

      if (!decodedToken || !decodedToken.adminId || !decodedToken.role) {
        console.log("authMiddleware: invalid token");
        return res.status(401).json({ error: "Invalid token" });
      }

      const adminId = decodedToken.adminId;
      const adminRepository = new AdminRepository(dataSource);
      const adminService = new AdminService(dataSource, adminRepository);
      const admin = await adminService.getAdminById(adminId);

      if (!admin) {
        console.log("authMiddleware: admin not found");
        return res.status(401).json({ error: "Unauthorized" });
      }

      if (!roles.includes(admin.role)) {
        console.log("authMiddleware: unauthorized role");
        return res.status(403).json({ error: "Forbidden" });
      }

      req.user = {
        id: admin.id,
        role: admin.role,
      };

      console.log("authMiddleware: success");
      next();
    } catch (error) {
      console.error("authMiddleware: error:", error);
      return res.status(401).json({ error: "Invalid token" });
    }
  };
}
