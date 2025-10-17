const ordersService = require("../services/orders.service");
const { successResponse, errorResponse } = require("../utils/response");

class OrdersController {
  // GET /api/orders
  getAllOrders(req, res, next) {
    try {
      const orders = ordersService.getAllOrders();
      return successResponse(res, orders, "Orders retrieved successfully");
    } catch (error) {
      next(error);
    }
  }

  // GET /api/orders/:id
  getOrderById(req, res, next) {
    try {
      const order = ordersService.getOrderById(req.params.id);
      if (!order) {
        return errorResponse(res, "Order not found", 404);
      }
      return successResponse(res, order, "Order retrieved successfully");
    } catch (error) {
      next(error);
    }
  }

  // POST /api/orders
  createOrder(req, res, next) {
    try {
      const { userId, items, total } = req.body;

      if (!userId || !items || !total) {
        return errorResponse(res, "UserId, items, and total are required", 400);
      }

      const newOrder = ordersService.createOrder({ userId, items, total });
      return successResponse(res, newOrder, "Order created successfully", 201);
    } catch (error) {
      next(error);
    }
  }

  // PUT /api/orders/:id
  updateOrder(req, res, next) {
    try {
      const updatedOrder = ordersService.updateOrder(req.params.id, req.body);
      if (!updatedOrder) {
        return errorResponse(res, "Order not found", 404);
      }
      return successResponse(res, updatedOrder, "Order updated successfully");
    } catch (error) {
      next(error);
    }
  }

  // DELETE /api/orders/:id
  deleteOrder(req, res, next) {
    try {
      const deletedOrder = ordersService.deleteOrder(req.params.id);
      if (!deletedOrder) {
        return errorResponse(res, "Order not found", 404);
      }
      return successResponse(res, deletedOrder, "Order deleted successfully");
    } catch (error) {
      next(error);
    }
  }
}

module.exports = new OrdersController();
