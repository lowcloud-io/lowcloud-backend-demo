require("dotenv").config();
const express = require("express");
const corsMiddleware = require("./middleware/cors");
const logger = require("./middleware/logger");
const errorHandler = require("./middleware/errorHandler");
const routes = require("./routes");
const db = require("./config/database");
const { runMigrations } = require("./config/migrate");

const app = express();
const port = process.env.PORT || 3000;

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(corsMiddleware); // CORS before routes
app.use(logger);

// Root Endpoint
app.get("/", (req, res) => {
    res.json({
        success: true,
        message: "Welcome to LowCloud Backend API",
        version: "1.0.0",
        endpoints: {
            users: "/api/users",
            products: "/api/products",
            orders: "/api/orders",
            health: "/api/health",
        },
        demo_endpoints: {
            users: "/api/demo/users",
            products: "/api/demo/products",
            orders: "/api/demo/orders",
        },
        info: "Main endpoints (/api/*) use PostgreSQL. Demo endpoints (/api/demo/*) use mock data.",
    });
});

// API Routes
app.use("/api", routes);

// 404 Handler
app.use((req, res) => {
    res.status(404).json({
        success: false,
        message: "Endpoint not found",
    });
});

// Error Handler (muss als letztes Middleware kommen)
app.use(errorHandler);

// Server starten
app.listen(port, async () => {
    console.log(`🚀 Server running on port ${port}`);
    console.log(`📍 API Base: http://localhost:${port}/api`);
    console.log(`💚 Health Check: http://localhost:${port}/api/health`);

    // Datenbank-Verbindungstest
    await db.testConnection();

    // Datenbank-Migrationen ausführen (nur wenn RUN_MIGRATIONS=true)
    await runMigrations();
});

// Graceful Shutdown
process.on("SIGTERM", async () => {
    console.log("⚠️  SIGTERM empfangen, fahre Server herunter...");
    await db.closePool();
    process.exit(0);
});

process.on("SIGINT", async () => {
    console.log("⚠️  SIGINT empfangen, fahre Server herunter...");
    await db.closePool();
    process.exit(0);
});
