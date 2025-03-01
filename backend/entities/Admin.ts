import { Entity, PrimaryGeneratedColumn, Column } from "typeorm";

@Entity({ name: "admins" })
export class Admin {
  @PrimaryGeneratedColumn()
  id: number = 0;

  @Column({ type: "varchar", length: 255, unique: true })
  username: string = "";

  @Column({ type: "varchar", length: 255 })
  password: string = "";

  @Column({ type: "enum", enum: ["admin", "superadmin"], default: "admin" })
  role: string = "";
}
