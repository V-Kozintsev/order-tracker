import { Entity, PrimaryGeneratedColumn, Column } from "typeorm";
import {
  IsNotEmpty,
  IsString,
  MaxLength,
  IsInt,
  Min,
  IsDate,
  IsEnum,
} from "class-validator";
import { Transform } from "class-transformer";

enum OrderStatus {
  Pending = "Pending",
  Processing = "Processing",
  Shipped = "Shipped",
  Delivered = "Delivered",
  Cancelled = "Cancelled",
}

@Entity({ name: "orders" })
export class Order {
  @PrimaryGeneratedColumn()
  id: number = 0;

  @IsNotEmpty({ message: "Номер заказа не может быть пустым" })
  @IsString({ message: "Номер заказа должен быть строкой" })
  @MaxLength(255, {
    message: "Номер заказа не может быть длиннее 255 символов",
  })
  @Column({ type: "varchar", length: 255 })
  order_number: string = "";

  @IsNotEmpty({ message: "Номер телефона клиента не может быть пустым" })
  @IsString({ message: "Номер телефона клиента должен быть строкой" })
  @MaxLength(20, {
    message: "Номер телефона клиента не может быть длиннее 20 символов",
  })
  @Column({ type: "varchar", length: 20 })
  customer_phone: string = "";

  @IsNotEmpty({ message: "Название продукта не может быть пустым" })
  @IsString({ message: "Название продукта должно быть строкой" })
  @MaxLength(255, {
    message: "Название продукта не может быть длиннее 255 символов",
  })
  @Column({ type: "varchar", length: 255 })
  product_name: string = "";

  /* @Column({ type: "varchar", length: 20, default: "" })
  customer_email: string = ""; */

  @IsNotEmpty({ message: "Количество не может быть пустым" })
  @IsInt({ message: "Количество должно быть целым числом" })
  @Min(1, { message: "Количество должно быть положительным числом" })
  @Column({ type: "integer" })
  quantity: number = 0;

  @IsNotEmpty({ message: "Дата доставки не может быть пустой" })
  @IsDate({ message: "Дата доставки должна быть датой" })
  @Transform(({ value }) => new Date(value)) // Преобразуем строку в Date
  @Column({ type: "date" })
  delivery_date: Date = new Date();

  @IsNotEmpty({ message: "Статус не может быть пустым" })
  @IsEnum(OrderStatus, {
    message:
      "Статус должен быть одним из: Pending, Processing, Shipped, Delivered, Cancelled",
  })
  @Column({ type: "varchar", length: 255 })
  status: string = "";
}
