const db = require("../../config/database");

class OrdersService {
    // GET all orders (mit User-Join)
    async getAllOrders() {
        const query = `
      SELECT 
        o.*,
        u.username,
        u.email
      FROM orders o
      LEFT JOIN users u ON o.user_id = u.id
      ORDER BY o.created_at DESC
    `;

        const { rows } = await db.query(query);
        return rows;
    }

    // GET order by ID (mit Items und Products)
    async getOrderById(id) {
        // Order mit User-Info
        const orderQuery = `
      SELECT 
        o.*,
        u.username,
        u.email
      FROM orders o
      LEFT JOIN users u ON o.user_id = u.id
      WHERE o.id = $1
    `;

        const { rows: orderRows } = await db.query(orderQuery, [id]);

        if (orderRows.length === 0) {
            throw new Error(`Order with ID ${id} not found`);
        }

        const order = orderRows[0];

        // Order Items mit Product-Details
        const itemsQuery = `
      SELECT 
        oi.*,
        p.name as product_name,
        p.description as product_description
      FROM order_items oi
      LEFT JOIN products p ON oi.product_id = p.id
      WHERE oi.order_id = $1
      ORDER BY oi.created_at
    `;

        const { rows: items } = await db.query(itemsQuery, [id]);

        return {
            ...order,
            items,
        };
    }

    // POST create order (mit Order Items in Transaction)
    async createOrder(orderData) {
        const { user_id, items, status } = orderData;

        // Validierung
        if (!user_id) {
            throw new Error("user_id is required");
        }

        if (!items || !Array.isArray(items) || items.length === 0) {
            throw new Error("items array is required and must not be empty");
        }

        // Validate items structure
        for (const item of items) {
            if (!item.product_id || !item.quantity || !item.price) {
                throw new Error("Each item must have product_id, quantity, and price");
            }
            if (item.quantity <= 0) {
                throw new Error("Item quantity must be positive");
            }
            if (item.price < 0) {
                throw new Error("Item price must be positive");
            }
        }

        // Berechne total_amount
        const total_amount = items.reduce((sum, item) => sum + item.quantity * item.price, 0);

        // Transaction starten
        const client = await db.pool.connect();

        try {
            await client.query("BEGIN");

            // 1. Order erstellen
            const orderQuery = `
        INSERT INTO orders (user_id, total_amount, status)
        VALUES ($1, $2, $3)
        RETURNING *
      `;

            const { rows: orderRows } = await client.query(orderQuery, [user_id, total_amount, status || "pending"]);

            const order = orderRows[0];

            // 2. Order Items erstellen
            const itemsInserted = [];

            for (const item of items) {
                const itemQuery = `
          INSERT INTO order_items (order_id, product_id, quantity, price)
          VALUES ($1, $2, $3, $4)
          RETURNING *
        `;

                const { rows: itemRows } = await client.query(itemQuery, [order.id, item.product_id, item.quantity, item.price]);

                itemsInserted.push(itemRows[0]);
            }

            await client.query("COMMIT");

            // Return kompletter Order mit Items
            return {
                ...order,
                items: itemsInserted,
            };
        } catch (error) {
            await client.query("ROLLBACK");

            // PostgreSQL Foreign Key Violation
            if (error.code === "23503") {
                if (error.constraint === "orders_user_id_fkey") {
                    throw new Error("User not found");
                }
                if (error.constraint === "order_items_product_id_fkey") {
                    throw new Error("Product not found");
                }
            }

            throw error;
        } finally {
            client.release();
        }
    }

    // PUT update order (nur Status)
    async updateOrder(id, orderData) {
        const { status } = orderData;

        // Prüfe ob Order existiert
        await this.getOrderById(id);

        if (!status) {
            throw new Error("Status is required");
        }

        const query = `
      UPDATE orders
      SET status = $1, updated_at = CURRENT_TIMESTAMP
      WHERE id = $2
      RETURNING *
    `;

        const { rows } = await db.query(query, [status, id]);
        return rows[0];
    }

    // DELETE order (CASCADE zu Items durch DB)
    async deleteOrder(id) {
        // Prüfe ob Order existiert
        const order = await this.getOrderById(id);

        const query = "DELETE FROM orders WHERE id = $1";
        await db.query(query, [id]);

        return order;
    }
}

module.exports = new OrdersService();
