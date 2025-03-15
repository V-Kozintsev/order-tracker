import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";

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
  const navigate = useNavigate();

  useEffect(() => {
    const fetchOrders = async () => {
      setLoading(true);
      setError("");

      try {
        const token = localStorage.getItem("adminToken");
        const response = await fetch("http://localhost:3001/admin/orders", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

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

  const handleDelete = async (orderId: number) => {
    try {
      const token = localStorage.getItem("adminToken");
      const response = await fetch(`http://localhost:3001/orders/${orderId}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      setOrders(orders.filter((order) => order.id !== orderId));
    } catch (e: any) {
      console.error(e);
    }
  };

  return (
    <div>
      <h2>Список заказов</h2>
      <button type="button" onClick={() => navigate("/admin")}>
        Назад
      </button>
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
                <button
                  onClick={() => navigate(`/admin/orders/edit/${order.id}`)}
                >
                  Редактировать
                </button>
                <button onClick={() => handleDelete(order.id)}>Удалить</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default OrderList;
