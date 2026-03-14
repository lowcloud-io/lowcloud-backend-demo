const express = require("express");
const router = express.Router();
const { isRedisReady } = require("../config/redis");

// Import Demo-Router (Mock-Daten)
const demoUsersRoutes = require("./demo/users.routes");
const demoProductsRoutes = require("./demo/products.routes");
const demoOrdersRoutes = require("./demo/orders.routes");

// Import DB-Router (PostgreSQL)
const dbUsersRoutes = require("./db/users.routes");
const dbProductsRoutes = require("./db/products.routes");
const dbOrdersRoutes = require("./db/orders.routes");

// Demo-Endpoints mit Mock-Daten unter /api/demo/*
router.use("/demo/users", demoUsersRoutes);
router.use("/demo/products", demoProductsRoutes);
router.use("/demo/orders", demoOrdersRoutes);

// Database-Endpoints mit PostgreSQL unter /api/*
router.use("/users", dbUsersRoutes);
router.use("/products", dbProductsRoutes);
router.use("/orders", dbOrdersRoutes);

// Health-Check Endpoint
router.get("/health", (req, res) => {
    const redisReady = isRedisReady();
    res.json({
        success: true,
        message: "API is running",
        timestamp: new Date().toISOString(),
        services: {
            redis: redisReady ? "connected" : "unavailable (in-memory fallback)",
        },
    });
});

module.exports = router;
