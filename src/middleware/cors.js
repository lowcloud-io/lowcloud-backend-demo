const cors = require("cors");

// Parse allowed origins from environment variable
// Format: "http://localhost:3000,http://localhost:5173,https://example.com"
const allowedOrigins =
  process.env.ALLOWED_ORIGINS?.split(",").map((o) => o.trim()) || [];

const corsOptions = {
  origin: (origin, callback) => {
    // Allow requests with no origin (like mobile apps, Postman, curl)
    if (!origin) {
      return callback(null, true);
    }

    // Wildcard: allow all origins (only for development!)
    if (allowedOrigins.includes("*")) {
      return callback(null, true);
    }

    // Check if origin is in whitelist
    if (allowedOrigins.includes(origin)) {
      return callback(null, true);
    }

    // Reject origin
    callback(new Error(`Origin ${origin} not allowed by CORS`));
  },
  credentials: true, // Allow cookies and authorization headers
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"],
  maxAge: 86400, // Cache preflight requests for 24 hours
};

module.exports = cors(corsOptions);
