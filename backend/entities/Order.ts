import { Entity, PrimaryGeneratedColumn, Column } from "typeorm";

@Entity({ name: "orders" })
export class Order {
  @PrimaryGeneratedColumn()
  id: number = 0; // Значение по умолчанию

  @Column({ type: "varchar", length: 255 })
  orderNumber: string = ""; // Значение по умолчанию

  @Column({ type: "varchar", length: 20 })
  customerPhone: string = ""; // Значение по умолчанию

  @Column({ type: "varchar", length: 255 })
  productName: string = ""; // Значение по умолчанию

  @Column({ type: "integer" })
  quantity: number = 0; // Значение по умолчанию

  @Column({ type: "date" })
  deliveryDate: Date = new Date(); // Значение по умолчанию

  @Column({ type: "varchar", length: 255 })
  status: string = ""; // Значение по умолчанию
}
