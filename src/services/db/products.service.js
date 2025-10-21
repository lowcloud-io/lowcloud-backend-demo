const db = require("../../config/database");

class ProductsService {
    // GET all products
    async getAllProducts() {
        const query = "SELECT * FROM products ORDER BY created_at DESC";
        const { rows } = await db.query(query);
        return rows;
    }

    // GET product by ID
    async getProductById(id) {
        const query = "SELECT * FROM products WHERE id = $1";
        const { rows } = await db.query(query, [id]);

        if (rows.length === 0) {
            throw new Error(`Product with ID ${id} not found`);
        }

        return rows[0];
    }

    // POST create product
    async createProduct(productData) {
        const { name, description, price, stock } = productData;

        // Validierung
        if (!name || price === undefined) {
            throw new Error("Name and price are required");
        }

        if (price < 0) {
            throw new Error("Price must be positive");
        }

        if (stock !== undefined && stock < 0) {
            throw new Error("Stock must be positive");
        }

        const query = `
      INSERT INTO products (name, description, price, stock)
      VALUES ($1, $2, $3, $4)
      RETURNING *
    `;

        const { rows } = await db.query(query, [name, description || null, price, stock !== undefined ? stock : 0]);

        return rows[0];
    }

    // PUT update product
    async updateProduct(id, productData) {
        const { name, description, price, stock } = productData;

        // Prüfe ob Product existiert
        await this.getProductById(id);

        // Validierung
        if (price !== undefined && price < 0) {
            throw new Error("Price must be positive");
        }

        if (stock !== undefined && stock < 0) {
            throw new Error("Stock must be positive");
        }

        // Dynamisches Update nur für vorhandene Felder
        const updates = [];
        const values = [];
        let paramIndex = 1;

        if (name !== undefined) {
            updates.push(`name = $${paramIndex++}`);
            values.push(name);
        }

        if (description !== undefined) {
            updates.push(`description = $${paramIndex++}`);
            values.push(description);
        }

        if (price !== undefined) {
            updates.push(`price = $${paramIndex++}`);
            values.push(price);
        }

        if (stock !== undefined) {
            updates.push(`stock = $${paramIndex++}`);
            values.push(stock);
        }

        if (updates.length === 0) {
            throw new Error("No fields to update");
        }

        updates.push(`updated_at = CURRENT_TIMESTAMP`);
        values.push(id);

        const query = `
      UPDATE products
      SET ${updates.join(", ")}
      WHERE id = $${paramIndex}
      RETURNING *
    `;

        const { rows } = await db.query(query, values);
        return rows[0];
    }

    // DELETE product
    async deleteProduct(id) {
        // Prüfe ob Product existiert
        const product = await this.getProductById(id);

        const query = "DELETE FROM products WHERE id = $1";
        await db.query(query, [id]);

        return product;
    }
}

module.exports = new ProductsService();
