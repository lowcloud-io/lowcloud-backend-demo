const fs = require("fs");
const path = require("path");
const db = require("./database");

/**
 * Führt SQL-Migrationen aus der init.sql aus
 * Wird nur ausgeführt wenn RUN_MIGRATIONS=true
 */
async function runMigrations() {
    // Prüfe ob Migrationen ausgeführt werden sollen
    if (process.env.RUN_MIGRATIONS !== "true") {
        console.log("⏭️  Migrationen übersprungen (RUN_MIGRATIONS != true)");
        return;
    }

    try {
        console.log("🔄 Starte Datenbank-Migrationen...");

        // Lese init.sql
        const sqlPath = path.join(__dirname, "../../db/init.sql");

        if (!fs.existsSync(sqlPath)) {
            console.log("⚠️  init.sql nicht gefunden, überspringe Migrationen");
            return;
        }

        const sql = fs.readFileSync(sqlPath, "utf8");

        // Führe SQL aus
        await db.query(sql);

        console.log("✅ Datenbank-Migrationen erfolgreich abgeschlossen");
    } catch (error) {
        console.error("❌ Fehler bei Datenbank-Migrationen:", error.message);
        // Fehler nicht werfen, damit App trotzdem startet
        // (z.B. wenn Tabellen bereits existieren)
    }
}

module.exports = { runMigrations };
