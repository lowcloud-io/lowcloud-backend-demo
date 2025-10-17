const productsService = require("../services/products.service");
const { successResponse, errorResponse } = require("../utils/response");

class ProductsController {
  // GET /api/products
  getAllProducts(req, res, next) {
    try {
      const products = productsService.getAllProducts();
      return successResponse(res, products, "Products retrieved successfully");
    } catch (error) {
      next(error);
    }
  }

  // GET /api/products/:id
  getProductById(req, res, next) {
    try {
      const product = productsService.getProductById(req.params.id);
      if (!product) {
        return errorResponse(res, "Product not found", 404);
      }
      return successResponse(res, product, "Product retrieved successfully");
    } catch (error) {
      next(error);
    }
  }

  // POST /api/products
  createProduct(req, res, next) {
    try {
      const { name, price, stock } = req.body;

      if (!name || !price) {
        return errorResponse(res, "Name and price are required", 400);
      }

      const newProduct = productsService.createProduct({ name, price, stock });
      return successResponse(
        res,
        newProduct,
        "Product created successfully",
        201
      );
    } catch (error) {
      next(error);
    }
  }

  // PUT /api/products/:id
  updateProduct(req, res, next) {
    try {
      const updatedProduct = productsService.updateProduct(
        req.params.id,
        req.body
      );
      if (!updatedProduct) {
        return errorResponse(res, "Product not found", 404);
      }
      return successResponse(
        res,
        updatedProduct,
        "Product updated successfully"
      );
    } catch (error) {
      next(error);
    }
  }

  // DELETE /api/products/:id
  deleteProduct(req, res, next) {
    try {
      const deletedProduct = productsService.deleteProduct(req.params.id);
      if (!deletedProduct) {
        return errorResponse(res, "Product not found", 404);
      }
      return successResponse(
        res,
        deletedProduct,
        "Product deleted successfully"
      );
    } catch (error) {
      next(error);
    }
  }
}

module.exports = new ProductsController();
