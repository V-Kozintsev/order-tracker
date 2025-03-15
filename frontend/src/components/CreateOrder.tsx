// src/components/CreateOrder.tsx
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";

interface FormValues {
  orderNumber: string; //комит
  customerPhone: string;
  deliveryAddress: string;
  deliveryDate: string;
  status: string;
  items: { name: string; quantity: number }[];
}

const CreateOrder: React.FC = () => {
  const [orderNumber, setOrderNumber] = useState("");
  const [customerPhone, setCustomerPhone] = useState("");
  const [deliveryAddress, setDeliveryAddress] = useState("");
  const [deliveryDate, setDeliveryDate] = useState("");
  const [status, setStatus] = useState("");
  const [items, setItems] = useState([{ name: "", quantity: 1 }]);
  const [error, setError] = useState("");
  const navigate = useNavigate();
  const [successMessage, setSuccessMessage] = useState("");
  const handleRemoveItem = (index: number) => {
    const updatedItems = [...items];
    updatedItems.splice(index, 1);
    setItems(updatedItems);
  };

  const handleAddItem = () => {
    setItems([...items, { name: "", quantity: 1 }]);
  };

  const handleItemChange = (
    index: number,
    field: "name" | "quantity",
    value: string | number
  ) => {
    // Указываем типы для value
    const updatedItems = [...items];

    if (field === "name") {
      updatedItems[index].name = value as string; //  Приводим тип к string
    } else if (field === "quantity") {
      updatedItems[index].quantity = Number(value); //  Приводим тип к number
    }
    setItems(updatedItems);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSuccessMessage("");

    const orderData: FormValues = {
      orderNumber,
      customerPhone,
      deliveryAddress,
      deliveryDate,
      status,
      items,
    };

    try {
      const token = localStorage.getItem("adminToken");
      const response = await fetch("http://localhost:3001/orders", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(orderData),
      });

      if (!response.ok) {
        setError("Не удалось создать заказ");
        return;
      }
      if (response.ok) {
        setSuccessMessage("Заказ успешно создан!");
        // Очищаем форму
        setOrderNumber("");
        setCustomerPhone("");
        setDeliveryAddress("");
        setDeliveryDate("");
        setStatus("");
        setItems([{ name: "", quantity: 1 }]);

        // Автоочистка сообщения через 3 секунды
        setTimeout(() => setSuccessMessage(""), 3000);
      }

      /* navigate("/admin");  */
    } catch (error: any) {
      setError("Произошла ошибка при создании заказа");
      console.error(error);
    }
  };

  return (
    <div>
      <h2>Создать заказ</h2>
      <Link to="/admin">
        <button
          style={{
            padding: "10px 20px",
            background: "#007bff",
            color: "white",
            border: "none",
            borderRadius: "4px",
            cursor: "pointer",
            marginBottom: "20px",
          }}
        >
          Вернуться в админ-панель
        </button>
      </Link>
      {successMessage && <p style={{ color: "green" }}>{successMessage}</p>}
      {error && <p style={{ color: "red" }}>{error}</p>}
      <form onSubmit={handleSubmit}>
        <div>
          <label htmlFor="orderNumber">Номер заказа:</label>
          <input
            type="text"
            id="orderNumber"
            value={orderNumber}
            onChange={(e) => setOrderNumber(e.target.value)}
          />
        </div>
        <div>
          <label htmlFor="customerPhone">Телефон клиента:</label>
          <input
            type="text"
            id="customerPhone"
            value={customerPhone}
            onChange={(e) => setCustomerPhone(e.target.value)}
          />
        </div>
        <div>
          <label htmlFor="deliveryAddress">Адрес доставки:</label>
          <input
            type="text"
            id="deliveryAddress"
            value={deliveryAddress}
            onChange={(e) => setDeliveryAddress(e.target.value)}
          />
        </div>
        <div>
          <label htmlFor="deliveryDate">Дата доставки:</label>
          <input
            type="date"
            id="deliveryDate"
            value={deliveryDate}
            onChange={(e) => setDeliveryDate(e.target.value)}
          />
        </div>
        <div>
          <label htmlFor="status">Статус:</label>
          <input
            type="text"
            id="status"
            value={status}
            onChange={(e) => setStatus(e.target.value)}
          />
        </div>
        <div>
          <h4>Позиции заказа:</h4>
          {items.map((item, index) => (
            <div key={index}>
              <label htmlFor={`name-${index}`}>Название:</label>
              <input
                type="text"
                id={`name-${index}`}
                value={item.name}
                onChange={(e) =>
                  handleItemChange(index, "name", e.target.value)
                }
              />
              <label htmlFor={`quantity-${index}`}>Количество:</label>
              <input
                type="number"
                id={`quantity-${index}`}
                value={item.quantity}
                onChange={(e) =>
                  handleItemChange(index, "quantity", e.target.value)
                }
              />
              <button
                type="button"
                onClick={() => handleRemoveItem(index)}
                style={{
                  marginLeft: "10px",
                  padding: "5px 10px",
                  background: "#dc3545",
                  color: "white",
                  border: "none",
                  borderRadius: "4px",
                  cursor: "pointer",
                }}
              >
                Удалить
              </button>
            </div>
          ))}
          <button type="button" onClick={handleAddItem}>
            Добавить позицию
          </button>
        </div>
        <button type="submit">Создать</button>
        {error && <p style={{ color: "red" }}>{error}</p>}
      </form>
    </div>
  );
};

export default CreateOrder;
