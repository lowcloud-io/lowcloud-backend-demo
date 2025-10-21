const ordersService = require("../../services/db/orders.service");
const { successResponse: success, errorResponse: error } = require("../../utils/response");

class OrdersController {
    // GET /api/orders
    async getAllOrders(req, res, next) {
        try {
            const orders = await ordersService.getAllOrders();
            return success(res, orders, "Orders retrieved successfully");
        } catch (err) {
            next(err);
        }
    }

    // GET /api/orders/:id
    async getOrderById(req, res, next) {
        try {
            const order = await ordersService.getOrderById(req.params.id);
            return success(res, order, "Order retrieved successfully");
        } catch (err) {
            if (err.message.includes("not found")) {
                return error(res, err.message, 404);
            }
            next(err);
        }
    }

    // POST /api/orders
    async createOrder(req, res, next) {
        try {
            const order = await ordersService.createOrder(req.body);
            return success(res, order, "Order created successfully", 201);
        } catch (err) {
            if (
                err.message.includes("required") ||
                err.message.includes("must be positive") ||
                err.message.includes("must not be empty") ||
                err.message.includes("must have") ||
                err.message.includes("not found")
            ) {
                return error(res, err.message, 400);
            }
            next(err);
        }
    }

    // PUT /api/orders/:id
    async updateOrder(req, res, next) {
        try {
            const order = await ordersService.updateOrder(req.params.id, req.body);
            return success(res, order, "Order updated successfully");
        } catch (err) {
            if (err.message.includes("not found")) {
                return error(res, err.message, 404);
            }
            if (err.message.includes("required")) {
                return error(res, err.message, 400);
            }
            next(err);
        }
    }

    // DELETE /api/orders/:id
    async deleteOrder(req, res, next) {
        try {
            const order = await ordersService.deleteOrder(req.params.id);
            return success(res, order, "Order deleted successfully");
        } catch (err) {
            if (err.message.includes("not found")) {
                return error(res, err.message, 404);
            }
            next(err);
        }
    }
}

module.exports = new OrdersController();
