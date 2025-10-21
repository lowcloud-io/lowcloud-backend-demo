const { Pool } = require("pg");

// Connection Pool Configuration
const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
    // Fallback auf einzelne Umgebungsvariablen
    host: process.env.POSTGRES_HOST || "localhost",
    port: process.env.POSTGRES_PORT || 5432,
    user: process.env.POSTGRES_USER || "postgres",
    password: process.env.POSTGRES_PASSWORD || "postgres",
    database: process.env.POSTGRES_DB || "lowcloud_db",
    // Pool-Konfiguration
    max: 20, // Maximale Anzahl von Clients im Pool
    idleTimeoutMillis: 30000, // Client wird nach 30s Inaktivität geschlossen
    connectionTimeoutMillis: 2000, // Timeout für neue Verbindungen
});

// Error Handler für Pool
pool.on("error", (err, client) => {
    console.error("❌ Unerwarteter Fehler im DB Pool:", err);
    process.exit(-1);
});

// Verbindungstest
const testConnection = async () => {
    try {
        const client = await pool.connect();
        const result = await client.query("SELECT NOW()");
        console.log("✅ PostgreSQL verbunden:", result.rows[0].now);
        client.release();
        return true;
    } catch (err) {
        console.error("❌ PostgreSQL Verbindungsfehler:", err.message);
        return false;
    }
};

// Graceful Shutdown
const closePool = async () => {
    try {
        await pool.end();
        console.log("🔌 PostgreSQL Pool geschlossen");
    } catch (err) {
        console.error("❌ Fehler beim Schließen des Pools:", err);
    }
};

module.exports = {
    pool,
    query: (text, params) => pool.query(text, params),
    testConnection,
    closePool,
};
