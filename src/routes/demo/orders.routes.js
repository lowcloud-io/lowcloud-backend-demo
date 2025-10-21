const express = require("express");
const router = express.Router();
const ordersController = require("../../controllers/demo/orders.controller");

// GET /api/demo/orders - Alle Orders
router.get("/", ordersController.getAllOrders.bind(ordersController));

// GET /api/demo/orders/:id - Order by ID
router.get("/:id", ordersController.getOrderById.bind(ordersController));

// POST /api/demo/orders - Order erstellen
router.post("/", ordersController.createOrder.bind(ordersController));

// PUT /api/demo/orders/:id - Order aktualisieren
router.put("/:id", ordersController.updateOrder.bind(ordersController));

// DELETE /api/demo/orders/:id - Order löschen
router.delete("/:id", ordersController.deleteOrder.bind(ordersController));

module.exports = router;
