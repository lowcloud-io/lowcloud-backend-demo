const usersService = require("../../services/db/users.service");
const { successResponse: success, errorResponse: error } = require("../../utils/response");

class UsersController {
    // GET /api/users
    async getAllUsers(req, res, next) {
        try {
            const users = await usersService.getAllUsers();
            return success(res, users, "Users retrieved successfully");
        } catch (err) {
            next(err);
        }
    }

    // GET /api/users/:id
    async getUserById(req, res, next) {
        try {
            const user = await usersService.getUserById(req.params.id);
            return success(res, user, "User retrieved successfully");
        } catch (err) {
            if (err.message.includes("not found")) {
                return error(res, err.message, 404);
            }
            next(err);
        }
    }

    // POST /api/users
    async createUser(req, res, next) {
        try {
            const user = await usersService.createUser(req.body);
            return success(res, user, "User created successfully", 201);
        } catch (err) {
            if (err.message.includes("required") || err.message.includes("Invalid") || err.message.includes("already exists")) {
                return error(res, err.message, 400);
            }
            next(err);
        }
    }

    // PUT /api/users/:id
    async updateUser(req, res, next) {
        try {
            const user = await usersService.updateUser(req.params.id, req.body);
            return success(res, user, "User updated successfully");
        } catch (err) {
            if (err.message.includes("not found")) {
                return error(res, err.message, 404);
            }
            if (err.message.includes("Invalid") || err.message.includes("already exists") || err.message.includes("No fields")) {
                return error(res, err.message, 400);
            }
            next(err);
        }
    }

    // DELETE /api/users/:id
    async deleteUser(req, res, next) {
        try {
            const user = await usersService.deleteUser(req.params.id);
            return success(res, user, "User deleted successfully");
        } catch (err) {
            if (err.message.includes("not found")) {
                return error(res, err.message, 404);
            }
            next(err);
        }
    }
}

module.exports = new UsersController();
