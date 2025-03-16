import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import Fuse from "fuse.js";

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
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState<OrderItem[]>([]);

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

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
    const fuse = new Fuse(orders, {
      keys: ["orderNumber", "customerPhone"],
    });
    const results = fuse.search(e.target.value).map((result) => result.item);
    setSearchResults(results);
  };

  return (
    <div className="order-list-container">
      <h2>Список заказов</h2>
      <button
        type="button"
        className="back-button"
        onClick={() => navigate("/admin")}
      >
        Назад
      </button>
      <input
        type="text"
        value={searchQuery}
        onChange={handleSearch}
        placeholder="Номер заказа или телефон"
        className="search-input"
      />
      {searchQuery && (
        <div className="search-results">
          <h3>Результаты поиска:</h3>
          <ul>
            {searchResults.map((result) => (
              <li key={result.id}>
                <span
                  onClick={() => navigate(`/admin/orders/edit/${result.id}`)}
                >
                  {result.orderNumber} - {result.customerPhone}
                </span>
                <hr className="result-divider" />
              </li>
            ))}
          </ul>
        </div>
      )}

      <table className="orders-table">
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
            <tr
              key={order.id}
              className="order-row"
              onClick={(e) => {
                const target = e.target as HTMLElement;
                if (target.tagName !== "BUTTON") {
                  navigate(`/admin/orders/edit/${order.id}`);
                }
              }}
            >
              <td>{order.id}</td>
              <td>{order.orderNumber}</td>
              <td>{order.customerPhone}</td>
              <td>{order.deliveryAddress}</td>
              <td>{order.deliveryDate}</td>
              <td>{order.status}</td>
              <td>
                <button
                  className="edit-button"
                  onClick={() => navigate(`/admin/orders/edit/${order.id}`)}
                >
                  Редактировать
                </button>
                <button
                  className="delete-button"
                  onClick={() => handleDelete(order.id)}
                >
                  Удалить
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default OrderList;
