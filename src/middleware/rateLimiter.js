const rateLimit = require("express-rate-limit");
const { RedisStore } = require("rate-limit-redis");
const { redisClient } = require("../config/redis");

// Store wird immer erstellt – sendCommand wird erst bei eingehenden Requests aufgerufen,
// nicht beim Modulstart. Redis ist dann bereits verbunden.
const buildStore = () =>
    new RedisStore({
        sendCommand: (...args) => redisClient.call(...args),
    });

const createLimiter = ({ windowMs, max, message }) =>
    rateLimit({
        windowMs,
        max,
        standardHeaders: true,  // RateLimit-* Header im Response
        legacyHeaders: false,   // X-RateLimit-* Header deaktivieren
        store: buildStore(),
        passOnStoreError: true, // Bei Redis-Fehler Request durchlassen statt crashen
        handler: (req, res) => {
            const retryAfter = res.getHeader("Retry-After");
            res.status(429).json({
                success: false,
                message: message || `Zu viele Anfragen. Bitte warte ${Math.ceil(windowMs / 60000)} Minuten.`,
                retryAfter: retryAfter ? Number(retryAfter) : null,
            });
        },
    });

// 200 Requests pro 15 Minuten für alle API-Routen
const apiLimiter = createLimiter({
    windowMs: 15 * 60 * 1000,
    max: parseInt(process.env.RATE_LIMIT_MAX || "200"),
    message: "Zu viele Anfragen von dieser IP. Bitte warte 15 Minuten.",
});

// 30 Requests pro 15 Minuten für schreibende Operationen (POST, PUT, DELETE)
const writeLimiter = createLimiter({
    windowMs: 15 * 60 * 1000,
    max: parseInt(process.env.RATE_LIMIT_WRITE_MAX || "30"),
    message: "Zu viele Schreibanfragen von dieser IP. Bitte warte 15 Minuten.",
});

module.exports = { apiLimiter, writeLimiter };
