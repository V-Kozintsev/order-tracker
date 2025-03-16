// backend/src/controllers/AdminController.ts
import { Request, Response } from "express";
import { DataSource } from "typeorm";
import { AdminService } from "../services/AdminService";
import { AdminRepository } from "../repositories/AdminRepository";

export class AdminController {
  private adminService: AdminService;

  constructor(
    private dataSource: DataSource,
    private adminRepository: AdminRepository
  ) {
    this.adminService = new AdminService(dataSource, adminRepository);
  }

  async createAdmin(req: Request, res: Response): Promise<void> {
    try {
      const { username, password, role } = req.body;

      const admin = await this.adminService.createAdmin(
        username,
        password,
        role
      );
      res.status(201).json(admin);
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: "Failed to create admin" });
    }
  }

  async loginAdmin(req: Request, res: Response): Promise<void> {
    try {
      const { username, password } = req.body;
      const admin = await this.adminService.authenticateAdmin(
        username,
        password
      );

      if (!admin) {
        res.status(401).json({ error: "Invalid credentials" });
        return;
      }

      // Генерируем JWT токен
      const token = this.adminService.generateJWT(admin);

      res.json({ message: "Login successful", token });
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: "Failed to login" });
    }
  }

  async getAdmin(req: Request, res: Response): Promise<void> {
    try {
      const adminId = parseInt(req.params.id);
      const admin = await this.adminService.getAdminById(adminId);

      if (!admin) {
        res.status(404).json({ error: "Admin not found" });
        return;
      }

      res.json(admin);
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: "Failed to get admin" });
    }
  }
}
