const Redis = require("ioredis");

const REDIS_URL = process.env.REDIS_URL || "redis://localhost:6379";

const redisClient = new Redis(REDIS_URL, {
    enableReadyCheck: true,
    maxRetriesPerRequest: 3,
    lazyConnect: true, // Kein sofortiger Connect – explizit via connectRedis()
    retryStrategy: (times) => {
        if (times > 5) return null; // Nach 5 Versuchen aufgeben
        return Math.min(times * 200, 2000); // Exponential backoff bis 2s
    },
});

redisClient.on("connect", () => {
    console.log("✅ Redis verbunden:", REDIS_URL);
});

redisClient.on("error", (err) => {
    console.error("❌ Redis Fehler:", err.message);
});

redisClient.on("close", () => {
    console.log("🔌 Redis Verbindung getrennt");
});

const connectRedis = async () => {
    try {
        await redisClient.connect();
        return true;
    } catch (err) {
        console.error("❌ Redis Verbindungsfehler:", err.message);
        return false;
    }
};

const closeRedis = async () => {
    try {
        await redisClient.quit();
        console.log("🔌 Redis Verbindung geschlossen");
    } catch (err) {
        console.error("❌ Fehler beim Schließen von Redis:", err.message);
    }
};

const isRedisReady = () => redisClient.status === "ready";

module.exports = { redisClient, connectRedis, closeRedis, isRedisReady };
