const express = require("express");
const router = express.Router();
const usersController = require("../../controllers/demo/users.controller");

// GET /api/demo/users - Alle Users
router.get("/", usersController.getAllUsers.bind(usersController));

// GET /api/demo/users/:id - User by ID
router.get("/:id", usersController.getUserById.bind(usersController));

// POST /api/demo/users - User erstellen
router.post("/", usersController.createUser.bind(usersController));

// PUT /api/demo/users/:id - User aktualisieren
router.put("/:id", usersController.updateUser.bind(usersController));

// DELETE /api/demo/users/:id - User löschen
router.delete("/:id", usersController.deleteUser.bind(usersController));

module.exports = router;
