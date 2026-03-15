const Redis = require("ioredis");

const REDIS_HOST = process.env.REDIS_HOST || "127.0.0.1"; // explizit IPv4 statt localhost (vermeidet ::1)
const REDIS_PORT = process.env.REDIS_PORT || 6379;
const REDIS_PASSWORD = process.env.REDIS_PASSWORD || "";

const REDIS_URL = process.env.REDIS_URL || (REDIS_PASSWORD ? `redis://:${REDIS_PASSWORD}@${REDIS_HOST}:${REDIS_PORT}` : `redis://${REDIS_HOST}:${REDIS_PORT}`);

const redisClient = new Redis(REDIS_URL, {
    enableReadyCheck: true,
    maxRetriesPerRequest: null, // null = kein Limit pro Request → verhindert MaxRetriesPerRequestError-Crash
    lazyConnect: true, // Kein sofortiger Connect – explizit via connectRedis()
    retryStrategy: (times) => {
        if (times > 5) {
            console.warn("⚠️  Redis nicht erreichbar – Rate Limiter läuft im In-Memory Fallback");
            return null; // Nach 5 Versuchen aufgeben, kein weiteres Retry
        }
        return Math.min(times * 200, 2000); // Exponential backoff bis 2s
    },
});

const safeRedisUrl = REDIS_URL.replace(/:([^@]+)@/, ":***@");

redisClient.on("connect", () => {
    console.log("✅ Redis verbunden:", safeRedisUrl);
});

redisClient.on("error", (err) => {
    console.error("❌ Redis Fehler:", err.message);
});

redisClient.on("close", () => {
    console.log("🔌 Redis Verbindung getrennt");
});

const connectRedis = async () => {
    if (redisClient.status !== "wait" && redisClient.status !== "end") {
        console.log("✅ Redis bereits verbunden (Status:", redisClient.status + ")");
        return true;
    }
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
