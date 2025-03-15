// src/components/AdminDashboard.tsx
import React from "react";
import { Link, useNavigate } from "react-router-dom";

const AdminDashboard: React.FC = () => {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("adminToken");
    navigate("/admin/login");
  };

  return (
    <div>
      <h2>Личный кабинет администратора</h2>
      <p>Добро пожаловать!</p>
      <Link to="/admin/orders/create">Создать заказ</Link>
      <Link to="/admin/orders">Показать весь список заказов</Link>
      <button onClick={handleLogout}>Выйти</button>
    </div>
  );
};

export default AdminDashboard;
