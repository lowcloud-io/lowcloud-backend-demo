const db = require("../../config/database");

class UsersService {
    // GET all users
    async getAllUsers() {
        const query = "SELECT * FROM users ORDER BY created_at DESC";
        const { rows } = await db.query(query);
        return rows;
    }

    // GET user by ID
    async getUserById(id) {
        const query = "SELECT * FROM users WHERE id = $1";
        const { rows } = await db.query(query, [id]);

        if (rows.length === 0) {
            throw new Error(`User with ID ${id} not found`);
        }

        return rows[0];
    }

    // POST create user
    async createUser(userData) {
        const { username, email } = userData;

        // Validierung
        if (!username || !email) {
            throw new Error("Username and email are required");
        }

        // Einfache Email-Validierung
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            throw new Error("Invalid email format");
        }

        const query = `
      INSERT INTO users (username, email)
      VALUES ($1, $2)
      RETURNING *
    `;

        try {
            const { rows } = await db.query(query, [username, email]);
            return rows[0];
        } catch (error) {
            // PostgreSQL Unique Constraint Violation
            if (error.code === "23505") {
                if (error.constraint === "users_username_key") {
                    throw new Error("Username already exists");
                }
                if (error.constraint === "users_email_key") {
                    throw new Error("Email already exists");
                }
            }
            throw error;
        }
    }

    // PUT update user
    async updateUser(id, userData) {
        const { username, email } = userData;

        // Prüfe ob User existiert
        await this.getUserById(id);

        // Dynamisches Update nur für vorhandene Felder
        const updates = [];
        const values = [];
        let paramIndex = 1;

        if (username !== undefined) {
            updates.push(`username = $${paramIndex++}`);
            values.push(username);
        }

        if (email !== undefined) {
            // Email-Validierung
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailRegex.test(email)) {
                throw new Error("Invalid email format");
            }
            updates.push(`email = $${paramIndex++}`);
            values.push(email);
        }

        if (updates.length === 0) {
            throw new Error("No fields to update");
        }

        updates.push(`updated_at = CURRENT_TIMESTAMP`);
        values.push(id);

        const query = `
      UPDATE users
      SET ${updates.join(", ")}
      WHERE id = $${paramIndex}
      RETURNING *
    `;

        try {
            const { rows } = await db.query(query, values);
            return rows[0];
        } catch (error) {
            // PostgreSQL Unique Constraint Violation
            if (error.code === "23505") {
                if (error.constraint === "users_username_key") {
                    throw new Error("Username already exists");
                }
                if (error.constraint === "users_email_key") {
                    throw new Error("Email already exists");
                }
            }
            throw error;
        }
    }

    // DELETE user
    async deleteUser(id) {
        // Prüfe ob User existiert
        const user = await this.getUserById(id);

        const query = "DELETE FROM users WHERE id = $1";
        await db.query(query, [id]);

        return user;
    }
}

module.exports = new UsersService();
