require("dotenv").config();
const express = require("express");
const logger = require("./middleware/logger");
const errorHandler = require("./middleware/errorHandler");
const routes = require("./routes");

const app = express();
const port = process.env.PORT || 3000;

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
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
app.listen(port, () => {
  console.log(`🚀 Server running on port ${port}`);
  console.log(`📍 API Base: http://localhost:${port}/api`);
  console.log(`💚 Health Check: http://localhost:${port}/api/health`);
});
