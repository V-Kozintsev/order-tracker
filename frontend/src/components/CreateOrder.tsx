import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";

interface FormValues {
  orderNumber: string;
  customerPhone: string;
  deliveryAddress: string;
  deliveryDate: string;
  status: string;
  items: { name: string; quantity: number; price: number }[];
}

const CreateOrder: React.FC = () => {
  const [orderNumber, setOrderNumber] = useState("");
  const [customerPhone, setCustomerPhone] = useState("+7");
  const [deliveryAddress, setDeliveryAddress] = useState("");
  const [deliveryDate, setDeliveryDate] = useState("");
  const [status, setStatus] = useState("");
  const [items, setItems] = useState([{ name: "", quantity: 1, price: 0 }]);
  const [error, setError] = useState("");
  const navigate = useNavigate();
  const [successMessage, setSuccessMessage] = useState("");
  const handleRemoveItem = (index: number) => {
    const updatedItems = [...items];
    updatedItems.splice(index, 1);
    setItems(updatedItems);
  };
  const handleCustomerPhoneChange = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const value = e.target.value;
    if (value.startsWith("+7")) {
      setCustomerPhone(value);
    } else {
      setCustomerPhone("+7" + value.replace(/\D+/g, ""));
    }
  };

  const handleAddItem = () => {
    setItems([...items, { name: "", quantity: 1, price: 0 }]);
  };

  const handleItemChange = (
    index: number,
    field: "name" | "quantity" | "price",
    value: string | number
  ) => {
    const updatedItems = [...items];

    if (field === "name") {
      updatedItems[index].name = value as string;
    } else if (field === "quantity") {
      updatedItems[index].quantity = Number(value);
    } else if (field === "price") {
      updatedItems[index].price = Number(value);
    }
    setItems(updatedItems);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSuccessMessage("");

    if (
      !orderNumber ||
      !customerPhone ||
      !deliveryAddress ||
      !deliveryDate ||
      !status ||
      items.some((item) => !item.name || item.quantity <= 0 || item.price <= 0)
    ) {
      setError("Все поля обязательны для заполнения");
      return;
    }

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
        setOrderNumber("");
        setCustomerPhone("+7");
        setDeliveryAddress("");
        setDeliveryDate("");
        setStatus("");
        setItems([{ name: "", quantity: 1, price: 0 }]);

        setTimeout(() => setSuccessMessage(""), 3000);
      }
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
            required
          />
        </div>
        <div>
          <label htmlFor="customerPhone">Телефон клиента:</label>
          <input
            type="tel"
            id="customerPhone"
            value={customerPhone}
            onChange={handleCustomerPhoneChange}
            required
            pattern="\+7\d{10}"
            placeholder="+7XXXXXXXXXX"
          />
        </div>
        <div>
          <label htmlFor="deliveryAddress">Адрес доставки:</label>
          <input
            type="text"
            id="deliveryAddress"
            value={deliveryAddress}
            onChange={(e) => setDeliveryAddress(e.target.value)}
            required
          />
        </div>
        <div>
          <label htmlFor="deliveryDate">Дата доставки:</label>
          <input
            type="date"
            id="deliveryDate"
            value={deliveryDate}
            onChange={(e) => setDeliveryDate(e.target.value)}
            required
          />
        </div>
        <div>
          <label>Статус:</label>
          <select
            value={status}
            onChange={(e) => setStatus(e.target.value)}
            required
          >
            <option value="">Выберите статус</option>
            <option value="Pending">Pending</option>
            <option value="Processing">Processing</option>
            <option value="Shipped">Shipped</option>
            <option value="Delivered">Delivered</option>
            <option value="Cancelled">Cancelled</option>
          </select>
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
                required
              />
              <label htmlFor={`quantity-${index}`}>Количество:</label>
              <input
                type="number"
                id={`quantity-${index}`}
                value={item.quantity}
                onChange={(e) =>
                  handleItemChange(index, "quantity", e.target.value)
                }
                required
                min={1}
              />
              <label htmlFor={`price-${index}`}>Цена:</label>
              <input
                type="number"
                id={`price-${index}`}
                value={item.price}
                onChange={(e) =>
                  handleItemChange(index, "price", e.target.value)
                }
                required
                min={0}
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
      </form>
    </div>
  );
};

export default CreateOrder;
