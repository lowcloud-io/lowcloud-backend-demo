require("dotenv").config();
const express = require("express");
const corsMiddleware = require("./middleware/cors");
const logger = require("./middleware/logger");
const errorHandler = require("./middleware/errorHandler");
const { apiLimiter, writeLimiter } = require("./middleware/rateLimiter");
const routes = require("./routes");
const db = require("./config/database");
const { runMigrations } = require("./config/migrate");
const { connectRedis, closeRedis } = require("./config/redis");

const app = express();
const port = process.env.PORT || 3000;

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(corsMiddleware); // CORS before routes
app.use(logger);

// Rate Limiting – global für alle /api Routen
app.use("/api", apiLimiter);
// Strengeres Limit für schreibende Operationen
app.use("/api", (req, res, next) => {
    if (["POST", "PUT", "DELETE"].includes(req.method)) {
        return writeLimiter(req, res, next);
    }
    next();
});

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

// Debug: Environment-Variablen loggen (Passwörter maskiert)
const mask = (val) => val ? `${val.slice(0, 3)}***` : "(nicht gesetzt)";
const show = (val) => val || "(nicht gesetzt)";
console.log("── ENV Debug ──────────────────────────────────");
console.log("  POSTGRES_HOST:       ", show(process.env.POSTGRES_HOST));
console.log("  POSTGRES_PORT:       ", show(process.env.POSTGRES_PORT));
console.log("  POSTGRES_USER:       ", show(process.env.POSTGRES_USER));
console.log("  POSTGRES_PASSWORD:   ", mask(process.env.POSTGRES_PASSWORD));
console.log("  POSTGRES_DB:         ", show(process.env.POSTGRES_DB));
console.log("  DATABASE_URL:        ", show(process.env.DATABASE_URL?.replace(/:([^@]+)@/, ":***@")));
console.log("  REDIS_HOST:          ", show(process.env.REDIS_HOST));
console.log("  REDIS_PORT:          ", show(process.env.REDIS_PORT));
console.log("  REDIS_PASSWORD:      ", mask(process.env.REDIS_PASSWORD));
console.log("  REDIS_URL:           ", show(process.env.REDIS_URL?.replace(/:([^@]+)@/, ":***@")));
console.log("  RATE_LIMIT_MAX:      ", show(process.env.RATE_LIMIT_MAX));
console.log("  RATE_LIMIT_WRITE_MAX:", show(process.env.RATE_LIMIT_WRITE_MAX));
console.log("  NODE_ENV:            ", show(process.env.NODE_ENV));
console.log("  PORT:                ", show(process.env.PORT));
console.log("───────────────────────────────────────────────");

// Server starten
app.listen(port, async () => {
    console.log(`🚀 Server running on port ${port}`);
    console.log(`📍 API Base: http://localhost:${port}/api`);
    console.log(`💚 Health Check: http://localhost:${port}/api/health`);

    // Datenbank-Verbindungstest
    await db.testConnection();

    // Redis verbinden (non-blocking – Degradation auf In-Memory bei Fehler)
    await connectRedis();

    // Datenbank-Migrationen ausführen (nur wenn RUN_MIGRATIONS=true)
    await runMigrations();
});

// Graceful Shutdown
process.on("SIGTERM", async () => {
    console.log("⚠️  SIGTERM empfangen, fahre Server herunter...");
    await db.closePool();
    await closeRedis();
    process.exit(0);
});

process.on("SIGINT", async () => {
    console.log("⚠️  SIGINT empfangen, fahre Server herunter...");
    await db.closePool();
    await closeRedis();
    process.exit(0);
});
