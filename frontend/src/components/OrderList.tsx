// src/components/OrderList.tsx
import React, { useState, useEffect } from "react";

interface OrderItem {
  id: number;
  orderNumber: string;
  customerPhone: string;
  deliveryAddress: string;
  deliveryDate: string;
  status: string;
  items: any[]; // Уточните тип items
}

const OrderList: React.FC = () => {
  const [orders, setOrders] = useState<OrderItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchOrders = async () => {
      setLoading(true);
      setError("");

      try {
        const response = await fetch("http://localhost:3001/admin/orders"); // Замените на ваш API-endpoint
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        setOrders(data);
      } catch (e: any) {
        setError("Failed to fetch orders");
        console.error(e);
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, []);

  if (loading) {
    return <p>Loading orders...</p>;
  }

  if (error) {
    return <p>Error: {error}</p>;
  }

  return (
    <div>
      <h2>Список заказов</h2>
      <table>
        <thead>
          <tr>
            <th>ID</th>
            <th>Номер заказа</th>
            <th>Телефон клиента</th>
            <th>Адрес доставки</th>
            <th>Дата доставки</th>
            <th>Статус</th>
            <th>Действия</th>
          </tr>
        </thead>
        <tbody>
          {orders.map((order) => (
            <tr key={order.id}>
              <td>{order.id}</td>
              <td>{order.orderNumber}</td>
              <td>{order.customerPhone}</td>
              <td>{order.deliveryAddress}</td>
              <td>{order.deliveryDate}</td>
              <td>{order.status}</td>
              <td>
                <button>Редактировать</button>
                <button>Удалить</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default OrderList;
