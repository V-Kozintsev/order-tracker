import { DataSource } from "typeorm";
import { Admin } from "./entities/Admin";
import * as bcrypt from "bcrypt";

async function seed(dataSource: DataSource) {
  try {
    const adminRepository = dataSource.getRepository(Admin);
    const superAdminPassword = process.env.SUPERADMIN_PASSWORD;

    if (!superAdminPassword) {
      throw new Error(
        "SUPERADMIN_PASSWORD is not set in environment variables!"
      );
    }

    const existingSuperAdmin = await adminRepository.findOne({
      where: { role: "superadmin" },
    });

    if (!existingSuperAdmin) {
      const hashedPassword = await bcrypt.hash(superAdminPassword, 10);
      const superAdmin = new Admin();
      superAdmin.username = "superadmin";
      superAdmin.password = hashedPassword;
      superAdmin.role = "superadmin";

      await adminRepository.save(superAdmin);
      console.log("Superadmin created successfully!");
    } else {
      console.log("Superadmin already exists.");
    }
  } catch (error) {
    console.error("Error seeding database:", error);
    process.exit(1); // Завершаем процесс с ошибкой
  }
}

export default seed;
