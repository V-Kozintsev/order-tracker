import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";

interface OrderItem {
  id: number;
  orderNumber: string;
  customerPhone: string;
  deliveryAddress: string;
  deliveryDate: string;
  status: string;
  items: any[]; // Уточните тип items
}

const EditOrder: React.FC = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [order, setOrder] = useState<OrderItem | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchOrder = async () => {
      try {
        const token = localStorage.getItem("adminToken");
        const response = await fetch(`http://localhost:3001/orders/${id}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();
        setOrder(data);
      } catch (err) {
        setError("Ошибка загрузки заказа");
      } finally {
        setLoading(false);
      }
    };
    fetchOrder();
  }, [id]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!order) return;

    try {
      const token = localStorage.getItem("adminToken");
      const response = await fetch(`http://localhost:3001/orders/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(order),
      });

      if (!response.ok) {
        throw new Error("Ошибка сохранения");
      }

      navigate("/admin/orders");
    } catch (err) {
      setError("Ошибка при сохранении изменений");
    }
  };

  const handleChange = (field: keyof OrderItem, value: string) => {
    setOrder((prev) => (prev ? { ...prev, [field]: value } : null));
  };

  if (loading) return <div>Загрузка...</div>;
  if (error) return <div>{error}</div>;
  if (!order) return <div>Заказ не найден</div>;

  return (
    <div>
      <h2>Редактирование заказа #{order.orderNumber}</h2>
      <form onSubmit={handleSubmit}>
        <div>
          <label>Номер заказа:</label>
          <input
            type="text"
            value={order.orderNumber}
            onChange={(e) => handleChange("orderNumber", e.target.value)}
          />
        </div>
        <div>
          <label>Телефон клиента:</label>
          <input
            value={order.customerPhone}
            onChange={(e) => handleChange("customerPhone", e.target.value)}
          />
        </div>
        <div>
          <label>Адрес доставки:</label>
          <input
            value={order.deliveryAddress}
            onChange={(e) => handleChange("deliveryAddress", e.target.value)}
          />
        </div>
        <div>
          <label>Дата доставки:</label>
          <input
            type="date"
            value={order.deliveryDate}
            onChange={(e) => handleChange("deliveryDate", e.target.value)}
          />
        </div>
        <div>
          <label>Статус:</label>
          <select
            value={order.status}
            onChange={(e) => handleChange("status", e.target.value)}
          >
            <option value="Pending">Pending</option>
            <option value="Processing">Processing</option>
            <option value="Shipped">Shipped</option>
            <option value="Delivered">Delivered</option>
            <option value="Cancelled">Cancelled</option>
          </select>
        </div>

        {/* Если у вас есть массив items, добавьте поля для редактирования позиций заказа */}
        {order.items && order.items.length > 0 && (
          <div>
            <h3>Позиции заказа:</h3>
            {order.items.map((item, index) => (
              <div key={index}>
                <label>Наименование:</label>
                <input
                  value={item.name}
                  onChange={(e) => {
                    const newItems = [...order.items];
                    newItems[index] = {
                      ...newItems[index],
                      name: e.target.value,
                    };
                    setOrder((prev) =>
                      prev ? { ...prev, items: newItems } : null
                    );
                  }}
                />
                <label>Количество:</label>
                <input
                  type="number"
                  value={item.quantity}
                  onChange={(e) => {
                    const newItems = [...order.items];
                    newItems[index] = {
                      ...newItems[index],
                      quantity: parseInt(e.target.value),
                    };
                    setOrder((prev) =>
                      prev ? { ...prev, items: newItems } : null
                    );
                  }}
                />
                <label>Цена:</label>
                <input
                  type="number"
                  value={item.price}
                  onChange={(e) => {
                    const newItems = [...order.items];
                    newItems[index] = {
                      ...newItems[index],
                      price: parseFloat(e.target.value),
                    };
                    setOrder((prev) =>
                      prev ? { ...prev, items: newItems } : null
                    );
                  }}
                />
              </div>
            ))}
          </div>
        )}

        <button type="submit">Сохранить изменения</button>
        <button type="button" onClick={() => navigate("/admin/orders")}>
          Назад
        </button>
        {error && <p style={{ color: "red" }}>{error}</p>}
      </form>
    </div>
  );
};

export default EditOrder;
