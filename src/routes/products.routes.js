const express = require("express");
const router = express.Router();
const productsController = require("../controllers/products.controller");

// GET /api/products - Alle Products
router.get("/", productsController.getAllProducts.bind(productsController));

// GET /api/products/:id - Product by ID
router.get("/:id", productsController.getProductById.bind(productsController));

// POST /api/products - Product erstellen
router.post("/", productsController.createProduct.bind(productsController));

// PUT /api/products/:id - Product aktualisieren
router.put("/:id", productsController.updateProduct.bind(productsController));

// DELETE /api/products/:id - Product löschen
router.delete(
  "/:id",
  productsController.deleteProduct.bind(productsController)
);

module.exports = router;
