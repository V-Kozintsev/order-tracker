// backend/entities/Order.ts
import { Entity, PrimaryGeneratedColumn, Column } from "typeorm";
import {
  IsNotEmpty,
  IsString,
  MaxLength,
  IsInt,
  Min,
  IsDate,
  IsEnum,
  IsArray,
  ValidateNested,
} from "class-validator";
import { Transform, Type } from "class-transformer";

enum OrderStatus {
  Pending = "Pending",
  Processing = "Processing",
  Shipped = "Shipped",
  Delivered = "Delivered",
  Cancelled = "Cancelled",
}

class OrderItem {
  @IsNotEmpty()
  @IsString()
  name: string = "";

  @IsNotEmpty()
  @IsInt()
  @Min(1)
  quantity: number = 0;
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
  orderNumber: string = ""; //  camelCase

  @IsNotEmpty({ message: "Номер телефона клиента не может быть пустым" })
  @IsString({ message: "Номер телефона клиента должен быть строкой" })
  @MaxLength(20, {
    message: "Номер телефона клиента не может быть длиннее 20 символов",
  })
  @Column({ type: "varchar", length: 20 })
  customerPhone: string = ""; //  camelCase

  @IsNotEmpty({ message: "Адрес доставки не может быть пустым" })
  @IsString({ message: "Адрес доставки должен быть строкой" })
  @MaxLength(255, {
    message: "Адрес доставки не может быть длиннее 255 символов",
  })
  @Column({ type: "varchar", length: 255 })
  deliveryAddress: string = ""; //  camelCase

  @IsNotEmpty({ message: "Дата доставки не может быть пустой" })
  @IsDate({ message: "Дата доставки должна быть датой" })
  @Transform(({ value }) => new Date(value)) // Преобразуем строку в Date
  @Column({ type: "date" })
  deliveryDate: Date = new Date(); //  camelCase

  @IsNotEmpty({ message: "Статус не может быть пустым" })
  @IsEnum(OrderStatus, {
    message:
      "Статус должен быть одним из: Pending, Processing, Shipped, Delivered, Cancelled",
  })
  @Column({ type: "varchar", length: 255 })
  status: string = ""; //  camelCase

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => OrderItem)
  @Column({ type: "jsonb", default: [] })
  items: OrderItem[] = [];
}
