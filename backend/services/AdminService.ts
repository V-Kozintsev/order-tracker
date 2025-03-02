// backend/src/services/AdminService.ts
import { DataSource } from "typeorm";
import { Admin } from "../entities/Admin";
import { AdminRepository } from "../repositories/AdminRepository";
import * as bcrypt from "bcrypt";
import * as jwt from "jsonwebtoken";

export class AdminService {
  private adminRepository: AdminRepository;

  constructor(
    private dataSource: DataSource,
    adminRepository: AdminRepository
  ) {
    //  Удаляем private из конструктора
    this.adminRepository = adminRepository;
  }

  async createAdmin(
    username: string,
    password: string,
    role: string = "admin"
  ): Promise<Admin> {
    // Хешируем пароль
    const hashedPassword = await bcrypt.hash(password, 10);

    const admin = new Admin();
    admin.username = username;
    admin.password = hashedPassword;
    admin.role = role;

    return this.adminRepository.create(admin);
  }

  async authenticateAdmin(
    username: string,
    password: string
  ): Promise<Admin | null> {
    const admin = await this.adminRepository.findByUsername(username);

    if (!admin) {
      return null;
    }

    // Сравниваем хешированный пароль с введенным паролем
    const passwordMatches = await bcrypt.compare(password, admin.password);

    if (!passwordMatches) {
      return null;
    }

    return admin;
  }

  async getAdminById(id: number): Promise<Admin | null> {
    return this.adminRepository.findOne(id);
  }

  generateJWT(admin: Admin): string {
    const payload = {
      adminId: admin.id,
      role: admin.role,
    };
    const secretKey = process.env.JWT_SECRET || "secret";
    const options: jwt.SignOptions = {
      expiresIn: "1h", // Токен истекает через 1 час
    };
    return jwt.sign(payload, secretKey, options);
  }
}
