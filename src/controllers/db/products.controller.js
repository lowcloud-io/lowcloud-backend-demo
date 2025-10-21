const productsService = require("../../services/db/products.service");
const { successResponse: success, errorResponse: error } = require("../../utils/response");

class ProductsController {
    // GET /api/products
    async getAllProducts(req, res, next) {
        try {
            const products = await productsService.getAllProducts();
            return success(res, products, "Products retrieved successfully");
        } catch (err) {
            next(err);
        }
    }

    // GET /api/products/:id
    async getProductById(req, res, next) {
        try {
            const product = await productsService.getProductById(req.params.id);
            return success(res, product, "Product retrieved successfully");
        } catch (err) {
            if (err.message.includes("not found")) {
                return error(res, err.message, 404);
            }
            next(err);
        }
    }

    // POST /api/products
    async createProduct(req, res, next) {
        try {
            const product = await productsService.createProduct(req.body);
            return success(res, product, "Product created successfully", 201);
        } catch (err) {
            if (err.message.includes("required") || err.message.includes("must be positive")) {
                return error(res, err.message, 400);
            }
            next(err);
        }
    }

    // PUT /api/products/:id
    async updateProduct(req, res, next) {
        try {
            const product = await productsService.updateProduct(req.params.id, req.body);
            return success(res, product, "Product updated successfully");
        } catch (err) {
            if (err.message.includes("not found")) {
                return error(res, err.message, 404);
            }
            if (err.message.includes("must be positive") || err.message.includes("No fields")) {
                return error(res, err.message, 400);
            }
            next(err);
        }
    }

    // DELETE /api/products/:id
    async deleteProduct(req, res, next) {
        try {
            const product = await productsService.deleteProduct(req.params.id);
            return success(res, product, "Product deleted successfully");
        } catch (err) {
            if (err.message.includes("not found")) {
                return error(res, err.message, 404);
            }
            next(err);
        }
    }
}

module.exports = new ProductsController();
