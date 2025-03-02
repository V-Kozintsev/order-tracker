import React, { useState } from "react";
import { useForm, SubmitHandler } from "react-hook-form";

interface OrderItem {
  name: string;
  quantity: number;
}

interface OrderDetails {
  orderNumber: string;
  customerPhone: string;
  deliveryAddress: string;
  deliveryDate: string;
  status: string;
  items: OrderItem[];
}

interface FormValues {
  phone: string;
  orderNumber: string;
}

const OrderDetailsComponent: React.FC = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormValues>();
  const [orderDetails, setOrderDetails] = useState<OrderDetails | null>(null);
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false); //  Новое состояние

  const onSubmit: SubmitHandler<FormValues> = async (data) => {
    setError("");
    setOrderDetails(null);
    setIsLoading(true); // Начинаем загрузку

    try {
      const response = await fetch(
        `http://localhost:3001/orders/client?phone=${encodeURIComponent(
          data.phone
        )}&orderNumber=${encodeURIComponent(data.orderNumber)}`
      );

      if (!response.ok) {
        if (response.status === 404) {
          setError("Заказ не найден");
        } else {
          setError("Не удалось получить информацию о заказе");
          console.error(response.status, response.statusText);
        }
        return;
      }

      const OrderDetailsData: OrderDetails = await response.json();
      setOrderDetails(OrderDetailsData);
    } catch (error: any) {
      setError("Не удалось получить информацию о заказе");
      console.error(error);
    } finally {
      setIsLoading(false); // Заканчиваем загрузку в любом случае (успех или ошибка)
    }
  };

  return (
    <div>
      <h2>Информация о заказе</h2>
      <form onSubmit={handleSubmit(onSubmit)}>
        <div>
          <label htmlFor="phone">Номер телефона:</label>
          <input
            type="text"
            id="phone"
            {...register("phone", {
              required: "Номер телефона обязателен",
              pattern: {
                value: /^\+\d{1,20}$/,
                message: "Неверный формат номера телефона",
              },
            })}
          />
          {errors.phone && (
            <p style={{ color: "red" }}>{errors.phone.message}</p>
          )}
        </div>
        <div>
          <label htmlFor="orderNumber">Номер заказа:</label>
          <input
            type="text"
            id="orderNumber"
            {...register("orderNumber", {
              required: "Номер заказа обязателен",
            })}
          />
          {errors.orderNumber && (
            <p style={{ color: "red" }}>{errors.orderNumber.message}</p>
          )}
        </div>
        <button type="submit" disabled={isLoading}>
          Найти заказ
        </button>
      </form>
      {isLoading && <p>Загрузка...</p>} {/* Индикатор загрузки */}
      {error && <p style={{ color: "red" }}>{error}</p>}
      {orderDetails && (
        <div>
          <h3>Детали заказа:</h3>
          <p>Номер заказа: {orderDetails.orderNumber}</p>
          <p>Номер телефона: {orderDetails.customerPhone}</p>
          <p>Адрес доставки: {orderDetails.deliveryAddress}</p>
          <p>Дата доставки: {orderDetails.deliveryDate}</p>
          <p>Статус: {orderDetails.status}</p>
          <h4>Позиции заказа:</h4>
          <ul>
            {orderDetails.items.map((item, index) => (
              <li key={index}>
                {item.name} - {item.quantity}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default OrderDetailsComponent;
