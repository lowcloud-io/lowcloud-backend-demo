const usersService = require("../services/users.service");
const { successResponse, errorResponse } = require("../utils/response");

class UsersController {
  // GET /api/users
  getAllUsers(req, res, next) {
    try {
      const users = usersService.getAllUsers();
      return successResponse(res, users, "Users retrieved successfully");
    } catch (error) {
      next(error);
    }
  }

  // GET /api/users/:id
  getUserById(req, res, next) {
    try {
      const user = usersService.getUserById(req.params.id);
      if (!user) {
        return errorResponse(res, "User not found", 404);
      }
      return successResponse(res, user, "User retrieved successfully");
    } catch (error) {
      next(error);
    }
  }

  // POST /api/users
  createUser(req, res, next) {
    try {
      const { name, email } = req.body;

      if (!name || !email) {
        return errorResponse(res, "Name and email are required", 400);
      }

      const newUser = usersService.createUser({ name, email });
      return successResponse(res, newUser, "User created successfully", 201);
    } catch (error) {
      next(error);
    }
  }

  // PUT /api/users/:id
  updateUser(req, res, next) {
    try {
      const updatedUser = usersService.updateUser(req.params.id, req.body);
      if (!updatedUser) {
        return errorResponse(res, "User not found", 404);
      }
      return successResponse(res, updatedUser, "User updated successfully");
    } catch (error) {
      next(error);
    }
  }

  // DELETE /api/users/:id
  deleteUser(req, res, next) {
    try {
      const deletedUser = usersService.deleteUser(req.params.id);
      if (!deletedUser) {
        return errorResponse(res, "User not found", 404);
      }
      return successResponse(res, deletedUser, "User deleted successfully");
    } catch (error) {
      next(error);
    }
  }
}

module.exports = new UsersController();
