const express = require("express");
const router = express.Router();

// Import aller Router
const usersRoutes = require("./users.routes");
const productsRoutes = require("./products.routes");
const ordersRoutes = require("./orders.routes");

// Mount Router auf jeweilige Pfade
router.use("/users", usersRoutes);
router.use("/products", productsRoutes);
router.use("/orders", ordersRoutes);

// Health-Check Endpoint
router.get("/health", (req, res) => {
  res.json({
    success: true,
    message: "API is running",
    timestamp: new Date().toISOString(),
  });
});

module.exports = router;
