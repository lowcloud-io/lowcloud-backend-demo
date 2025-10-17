const express = require("express");
const router = express.Router();
const ordersController = require("../controllers/orders.controller");

// GET /api/orders - Alle Orders
router.get("/", ordersController.getAllOrders.bind(ordersController));

// GET /api/orders/:id - Order by ID
router.get("/:id", ordersController.getOrderById.bind(ordersController));

// POST /api/orders - Order erstellen
router.post("/", ordersController.createOrder.bind(ordersController));

// PUT /api/orders/:id - Order aktualisieren
router.put("/:id", ordersController.updateOrder.bind(ordersController));

// DELETE /api/orders/:id - Order löschen
router.delete("/:id", ordersController.deleteOrder.bind(ordersController));

module.exports = router;
