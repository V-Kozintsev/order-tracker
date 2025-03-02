// seed.ts
import { DataSource } from "typeorm";
import { Admin } from "./entities/Admin";
import * as bcrypt from "bcrypt";

async function seed(dataSource: DataSource) {
  try {
    const adminRepository = dataSource.getRepository(Admin);

    // Проверяем, существует ли уже superadmin
    const existingSuperAdmin = await adminRepository.findOne({
      where: { role: "superadmin" },
    });

    if (!existingSuperAdmin) {
      // Создаем superadmin
      const hashedPassword = await bcrypt.hash(
        "4Kd3UAMZhlAKg6I1LniS0Y5zKO7jyeT7",
        10
      ); //  Замените "superadminpassword" на более надежный пароль
      const superAdmin = new Admin();
      superAdmin.username = "superadmin"; //  Замените "superadmin" на желаемое имя пользователя
      superAdmin.password = hashedPassword;
      superAdmin.role = "superadmin";

      await adminRepository.save(superAdmin);
      console.log("Superadmin created successfully!");
    } else {
      console.log("Superadmin already exists.");
    }
  } catch (error) {
    console.error("Error seeding database:", error);
  }
}

export default seed;
