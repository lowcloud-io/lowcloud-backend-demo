const express = require("express");
const router = express.Router();
const productsController = require("../../controllers/demo/products.controller");

// GET /api/demo/products - Alle Products
router.get("/", productsController.getAllProducts.bind(productsController));

// GET /api/demo/products/:id - Product by ID
router.get("/:id", productsController.getProductById.bind(productsController));

// POST /api/demo/products - Product erstellen
router.post("/", productsController.createProduct.bind(productsController));

// PUT /api/demo/products/:id - Product aktualisieren
router.put("/:id", productsController.updateProduct.bind(productsController));

// DELETE /api/demo/products/:id - Product löschen
router.delete("/:id", productsController.deleteProduct.bind(productsController));

module.exports = router;
