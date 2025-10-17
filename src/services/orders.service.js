// Mock-Datenbank für Orders
let orders = [
  {
    id: 1,
    userId: 1,
    items: [
      { productId: 1, quantity: 1 },
      { productId: 2, quantity: 2 },
    ],
    total: 1059.97,
    status: "completed",
  },
  {
    id: 2,
    userId: 2,
    items: [{ productId: 3, quantity: 1 }],
    total: 79.99,
    status: "pending",
  },
];

let nextId = 3;

class OrdersService {
  getAllOrders() {
    return orders;
  }

  getOrderById(id) {
    return orders.find((order) => order.id === parseInt(id));
  }

  createOrder(orderData) {
    const newOrder = {
      id: nextId++,
      userId: orderData.userId,
      items: orderData.items,
      total: orderData.total,
      status: orderData.status || "pending",
      createdAt: new Date().toISOString(),
    };
    orders.push(newOrder);
    return newOrder;
  }

  updateOrder(id, orderData) {
    const index = orders.findIndex((order) => order.id === parseInt(id));
    if (index === -1) return null;

    orders[index] = {
      ...orders[index],
      ...orderData,
      id: parseInt(id),
    };
    return orders[index];
  }

  deleteOrder(id) {
    const index = orders.findIndex((order) => order.id === parseInt(id));
    if (index === -1) return null;

    const deletedOrder = orders[index];
    orders.splice(index, 1);
    return deletedOrder;
  }
}

module.exports = new OrdersService();
