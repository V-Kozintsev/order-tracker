//OrederDetails.tsx
import React, { useState } from "react";
import { useForm, SubmitHandler } from "react-hook-form";
import { useNavigate } from "react-router-dom";

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
  const navigate = useNavigate();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormValues>();
  const [orderDetails, setOrderDetails] = useState<OrderDetails | null>(null);
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false); //  Новое состояние
  // Новые состояния для админской авторизации
  const [adminUsername, setAdminUsername] = useState("");
  const [adminPassword, setAdminPassword] = useState("");
  const [adminError, setAdminError] = useState("");
  const [showAdminLogin, setShowAdminLogin] = useState(false);

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

  const handleAdminLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setAdminError("");

    try {
      const response = await fetch("http://localhost:3001/admins/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          username: adminUsername,
          password: adminPassword,
        }),
      });

      if (!response.ok) {
        setAdminError("Неверные учетные данные");
        return;
      }

      const data = await response.json();
      localStorage.setItem("adminToken", data.token);
      navigate("/admin"); // Перенаправление в админ-панель
      setShowAdminLogin(false);
    } catch (error) {
      setAdminError("Ошибка при входе");
      console.error(error);
    }
  };

  return (
    <div>
      {/* Кнопка для открытия формы входа */}
      <div style={{ margin: "20px 0" }}>
        <button
          onClick={() => setShowAdminLogin(true)}
          style={{
            padding: "10px 20px",
            background: "#007bff",
            color: "white",
            border: "none",
            borderRadius: "4px",
            cursor: "pointer",
          }}
        >
          Вход для администратора
        </button>
      </div>
      {/* Модальное окно для входа администратора */}
      {showAdminLogin && (
        <div
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: "rgba(0,0,0,0.5)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <div
            style={{
              background: "white",
              padding: "20px",
              borderRadius: "8px",
              width: "300px",
            }}
          >
            <h3>Вход в админ-панель</h3>
            <form onSubmit={handleAdminLogin}>
              <div style={{ marginBottom: "15px" }}>
                <label>Логин:</label>
                <input
                  type="text"
                  value={adminUsername}
                  onChange={(e) => setAdminUsername(e.target.value)}
                  style={{ width: "100%", padding: "8px" }}
                />
              </div>
              <div style={{ marginBottom: "15px" }}>
                <label>Пароль:</label>
                <input
                  type="password"
                  value={adminPassword}
                  onChange={(e) => setAdminPassword(e.target.value)}
                  style={{ width: "100%", padding: "8px" }}
                />
              </div>
              {adminError && <p style={{ color: "red" }}>{adminError}</p>}
              <div style={{ display: "flex", gap: "10px" }}>
                <button
                  type="submit"
                  style={{
                    padding: "8px 16px",
                    background: "#28a745",
                    color: "white",
                    border: "none",
                    borderRadius: "4px",
                    cursor: "pointer",
                  }}
                >
                  Войти
                </button>
                <button
                  type="button"
                  onClick={() => setShowAdminLogin(false)}
                  style={{
                    padding: "8px 16px",
                    background: "#dc3545",
                    color: "white",
                    border: "none",
                    borderRadius: "4px",
                    cursor: "pointer",
                  }}
                >
                  Отмена
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
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
