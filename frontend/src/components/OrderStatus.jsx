//OrderStatus.js # Компонент для отображения статуса заказа

// src/components/OrderStatus.jsx
import React, { useState } from "react";

export function OrderStatus() {
  const [orderNumber, setOrderNumber] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [status, setStatus] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = async (event) => {
    event.preventDefault();

    try {
      const response = await fetch(
        `http://localhost:3001/api/order/${orderNumber}/${phoneNumber}`
      );

      if (response.ok) {
        const data = await response.json();
        setStatus(data.status);
        setError("");
      } else if (response.status === 404) {
        setError("Order not found");
        setStatus("");
      } else {
        setError("Failed to get order status");
        setStatus("");
      }
    } catch (error) {
      console.error(error);
      setError("Failed to connect to the server");
      setStatus("");
    }
  };

  return (
    <div>
      <h2>Order Status</h2>
      <form onSubmit={handleSubmit}>
        <div>
          <label htmlFor="orderNumber">Order Number:</label>
          <input
            type="text"
            id="orderNumber"
            value={orderNumber}
            onChange={(e) => setOrderNumber(e.target.value)}
          />
        </div>
        <div>
          <label htmlFor="phoneNumber">Phone Number:</label>
          <input
            type="text"
            id="phoneNumber"
            value={phoneNumber}
            onChange={(e) => setPhoneNumber(e.target.value)}
          />
        </div>
        <button type="submit">Get Status</button>
      </form>

      {status && <p>Order Status: {status}</p>}
      {error && <p style={{ color: "red" }}>Error: {error}</p>}
    </div>
  );
}
