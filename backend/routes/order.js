//order.js # Маршруты, связанные с заказами

// order.js # Маршруты, связанные с заказами

const express = require("express");
const router = express.Router();
const pool = require("../db");

router.get("/:orderNumber/:phoneNumber", async (req, res) => {
  const { orderNumber, phoneNumber } = req.params;

  try {
    const result = await pool.query(
      "SELECT status FROM orders WHERE order_number = $1 AND phone_number = $2",
      [orderNumber, phoneNumber]
    );

    if (result.rows.length > 0) {
      res.json({ status: result.rows[0].status });
    } else {
      res.status(404).json({ message: "Order not found" });
    }
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to get order status" });
  }
});

module.exports = router;
