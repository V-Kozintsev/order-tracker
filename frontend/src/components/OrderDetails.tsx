import React, { useEffect, useState } from "react";
import { useForm, SubmitHandler } from "react-hook-form";
import { useNavigate } from "react-router-dom";

interface OrderItem {
  name: string;
  quantity: number;
  price: number;
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
    setValue, // Добавляем setValue из useForm
  } = useForm<FormValues>();
  const [orderDetails, setOrderDetails] = useState<OrderDetails | null>(null);
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [adminUsername, setAdminUsername] = useState("");
  const [adminPassword, setAdminPassword] = useState("");
  const [adminError, setAdminError] = useState("");
  const [showAdminLogin, setShowAdminLogin] = useState(false);

  // Функция для автозаполнения "+7" и форматирования номера телефона
  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let value = e.target.value;
    if (!value.startsWith("+7")) {
      value = "+7" + value.replace(/\D/g, "").slice(0, 10);
    }
    setValue("phone", value); // Используем setValue для обновления значения в useForm
  };

  useEffect(() => {
    setValue("phone", "+7"); // Устанавливаем начальное значение "+7" при загрузке компонента
  }, [setValue]);

  const onSubmit: SubmitHandler<FormValues> = async (data) => {
    setError("");
    setOrderDetails(null);
    setIsLoading(true);

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
      setIsLoading(false);
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
      navigate("/admin");
      setShowAdminLogin(false);
    } catch (error) {
      setAdminError("Ошибка при входе");
      console.error(error);
    }
  };

  return (
    <div className="order-details-container">
      {/* Кнопка для открытия формы входа */}
      <div className="admin-login-button-container">
        <button
          onClick={() => setShowAdminLogin(true)}
          className="admin-login-button"
        >
          Вход для администратора
        </button>
      </div>
      {/* Модальное окно для входа администратора */}
      {showAdminLogin && (
        <div className="admin-login-modal">
          <div className="admin-login-form-container">
            <h3>Вход в админ-панель</h3>
            <form onSubmit={handleAdminLogin}>
              <div className="form-group">
                <label>Логин:</label>
                <input
                  type="text"
                  value={adminUsername}
                  onChange={(e) => setAdminUsername(e.target.value)}
                />
              </div>
              <div className="form-group">
                <label>Пароль:</label>
                <input
                  type="password"
                  value={adminPassword}
                  onChange={(e) => setAdminPassword(e.target.value)}
                />
              </div>
              {adminError && <p className="error-message">{adminError}</p>}
              <div className="admin-login-buttons">
                <button type="submit" className="submit-button">
                  Войти
                </button>
                <button
                  type="button"
                  onClick={() => setShowAdminLogin(false)}
                  className="cancel-button"
                >
                  Отмена
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
      <h2>Информация о заказе</h2>
      <form onSubmit={handleSubmit(onSubmit)} className="order-form">
        <div className="form-group">
          <label htmlFor="phone">
            Номер телефона:
            <span className="phone-hint">
              (Начните ввод номера, +7 будет автоматически добавлено)
            </span>
          </label>
          <input
            type="tel"
            id="phone"
            {...register("phone", {
              required: "Номер телефона обязателен",
              pattern: {
                value: /^\+\d{1,20}$/,
                message: "Неверный формат номера телефона",
              },
            })}
            onChange={handlePhoneChange} // Подключаем обработчик изменения номера телефона
            defaultValue="+7" // Устанавливаем начальное значение "+7"
          />
          {errors.phone && (
            <p className="error-message">{errors.phone.message}</p>
          )}
        </div>
        <div className="form-group">
          <label htmlFor="orderNumber">Номер заказа:</label>
          <input
            type="text"
            id="orderNumber"
            {...register("orderNumber", {
              required: "Номер заказа обязателен",
            })}
          />
          {errors.orderNumber && (
            <p className="error-message">{errors.orderNumber.message}</p>
          )}
        </div>
        <button type="submit" disabled={isLoading} className="submit-button">
          Найти заказ
        </button>
      </form>
      {isLoading && <p>Загрузка...</p>}
      {error && <p className="error-message">{error}</p>}
      {orderDetails && (
        <div className="order-details">
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
                {item.name} - {item.quantity} шт. - Цена: {item.price} руб.
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default OrderDetailsComponent;
