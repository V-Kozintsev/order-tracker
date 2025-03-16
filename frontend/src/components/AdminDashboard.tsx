import React from "react";
import { Link, useNavigate } from "react-router-dom";

const AdminDashboard: React.FC = () => {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("adminToken");
    navigate("/admin/login");
  };

  return (
    <div className="admin-dashboard-container">
      <h2>Личный кабинет администратора</h2>
      <p className="welcome-message">Добро пожаловать!</p>
      <div className="dashboard-links">
        <Link to="/admin/orders/create" className="dashboard-link">
          Создать заказ
        </Link>
        <Link to="/admin/orders" className="dashboard-link">
          Показать весь список заказов
        </Link>
      </div>
      <button onClick={handleLogout} className="logout-button">
        Выйти
      </button>
    </div>
  );
};

export default AdminDashboard;
