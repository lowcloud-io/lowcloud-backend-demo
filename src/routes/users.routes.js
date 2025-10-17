const express = require("express");
const router = express.Router();
const usersController = require("../controllers/users.controller");

// GET /api/users - Alle Users
router.get("/", usersController.getAllUsers.bind(usersController));

// GET /api/users/:id - User by ID
router.get("/:id", usersController.getUserById.bind(usersController));

// POST /api/users - User erstellen
router.post("/", usersController.createUser.bind(usersController));

// PUT /api/users/:id - User aktualisieren
router.put("/:id", usersController.updateUser.bind(usersController));

// DELETE /api/users/:id - User löschen
router.delete("/:id", usersController.deleteUser.bind(usersController));

module.exports = router;
