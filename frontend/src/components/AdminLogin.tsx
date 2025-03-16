// src/components/AdminLogin.tsx
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

const AdminLogin: React.FC = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    try {
      const response = await fetch("http://localhost:3001/admins/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ username, password }),
      });

      if (!response.ok) {
        setError("Неверное имя пользователя или пароль");
        return;
      }

      const data = await response.json();
      const token = data.token;

      localStorage.setItem("adminToken", token);
      navigate("/admin");
    } catch (error: any) {
      setError("Не удалось войти");
      console.error(error);
    }
  };

  return (
    <div>
      <h2>Вход в админ-панель</h2>
      <form onSubmit={handleSubmit}>
        <div>
          <label htmlFor="username">Имя пользователя:</label>
          <input
            type="text"
            id="username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />
        </div>
        <div>
          <label htmlFor="password">Пароль:</label>
          <input
            type="password"
            id="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>
        <button type="submit">Войти</button>
      </form>
      {error && <p style={{ color: "red" }}>{error}</p>}
    </div>
  );
};

export default AdminLogin;
