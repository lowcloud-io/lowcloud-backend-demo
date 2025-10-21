# LowCloud Backend Demo

Express.js Backend mit Layered Architecture (Router → Controller → Service)

## 🚀 Quick Start

### 1. Datenbank starten (PostgreSQL mit Docker)

```bash
# PostgreSQL Container starten
docker-compose up -d

# Container-Status prüfen
docker-compose ps

# Logs anzeigen
docker-compose logs -f postgres
```

### 2. Environment-Variablen konfigurieren

Erstelle eine `.env`-Datei im Root-Verzeichnis:

```env
# Server Configuration
PORT=3000

# Database Configuration
POSTGRES_USER=postgres
POSTGRES_PASSWORD=postgres
POSTGRES_DB=lowcloud_db
POSTGRES_HOST=localhost
POSTGRES_PORT=5433

# Database Connection String
DATABASE_URL=postgresql://postgres:postgres@localhost:5433/lowcloud_db
```

### 3. Dependencies installieren & Server starten

```bash
# Dependencies installieren
npm install

# Development-Server mit Hot-Reload
npm run dev

# Production-Server
npm start
```

Der Server läuft standardmäßig auf `http://localhost:3000`

### Datenbank-Management

```bash
# Container stoppen
docker-compose stop

# Container stoppen & löschen (Daten bleiben erhalten)
docker-compose down

# Container + Daten löschen (⚠️ Vorsicht!)
docker-compose down -v

# PostgreSQL Shell öffnen
docker exec -it lowcloud-postgres psql -U postgres -d lowcloud_db
```

## 📁 Projektstruktur

```
/src
  /routes
    /db                → DB-Routes (PostgreSQL)
    /demo              → Demo-Routes (Mock-Daten)
    index.js           → Haupt-Router
  /controllers
    /db                → DB-Controller (PostgreSQL)
    /demo              → Demo-Controller (Mock-Daten)
  /services
    /db                → DB-Services (PostgreSQL)
    /demo              → Demo-Services (Mock-Daten)
  /middleware          → Custom Middleware (Error Handler, Logging)
  /config              → Konfiguration (Database Connection Pool)
  /utils               → Hilfsfunktionen
  index.js             → Entry Point
/db
  init.sql             → Datenbank-Schema & Seed-Daten
```

## 🔌 API-Endpunkte

### Root

-   `GET /` - API-Übersicht

### Health Check

-   `GET /api/health` - Status des Servers

### Demo Endpoints (Mock-Daten)

Diese Endpoints nutzen In-Memory Mock-Daten und dienen zu Demonstrationszwecken.

**Users:**

-   `GET /api/demo/users` - Alle Users
-   `GET /api/demo/users/:id` - User by ID
-   `POST /api/demo/users` - User erstellen
-   `PUT /api/demo/users/:id` - User aktualisieren
-   `DELETE /api/demo/users/:id` - User löschen

**Products:**

-   `GET /api/demo/products` - Alle Products
-   `GET /api/demo/products/:id` - Product by ID
-   `POST /api/demo/products` - Product erstellen
-   `PUT /api/demo/products/:id` - Product aktualisieren
-   `DELETE /api/demo/products/:id` - Product löschen

**Orders:**

-   `GET /api/demo/orders` - Alle Orders
-   `GET /api/demo/orders/:id` - Order by ID
-   `POST /api/demo/orders` - Order erstellen
-   `PUT /api/demo/orders/:id` - Order aktualisieren
-   `DELETE /api/demo/orders/:id` - Order löschen

### Database Endpoints (PostgreSQL)

Diese Endpoints nutzen die PostgreSQL-Datenbank für persistente Datenspeicherung.

**Users:**

-   `GET /api/users` - Alle Users aus DB
-   `GET /api/users/:id` - User by ID aus DB
-   `POST /api/users` - User in DB erstellen (Body: `username`, `email`)
-   `PUT /api/users/:id` - User in DB aktualisieren
-   `DELETE /api/users/:id` - User aus DB löschen

**Products:**

-   `GET /api/products` - Alle Products aus DB
-   `GET /api/products/:id` - Product by ID aus DB
-   `POST /api/products` - Product in DB erstellen (Body: `name`, `description`, `price`, `stock`)
-   `PUT /api/products/:id` - Product in DB aktualisieren
-   `DELETE /api/products/:id` - Product aus DB löschen

**Orders:**

-   `GET /api/orders` - Alle Orders aus DB (mit User-Daten)
-   `GET /api/orders/:id` - Order by ID aus DB (mit Items und Product-Details)
-   `POST /api/orders` - Order in DB erstellen (Body: `user_id`, `items[]`, optional `status`)
-   `PUT /api/orders/:id` - Order-Status aktualisieren (Body: `status`)
-   `DELETE /api/orders/:id` - Order aus DB löschen (inkl. Items)

## 📝 Beispiel-Requests

### Database Endpoints (PostgreSQL)

**User erstellen:**

```bash
curl -X POST http://localhost:3000/api/users \
  -H "Content-Type: application/json" \
  -d '{"username":"johndoe","email":"john@example.com"}'
```

**Product erstellen:**

```bash
curl -X POST http://localhost:3000/api/products \
  -H "Content-Type: application/json" \
  -d '{"name":"Monitor","description":"27 inch 4K","price":299.99,"stock":20}'
```

**Order erstellen:**

```bash
curl -X POST http://localhost:3000/api/orders \
  -H "Content-Type: application/json" \
  -d '{
    "user_id": 1,
    "items": [
      {"product_id": 1, "quantity": 2, "price": 999.99},
      {"product_id": 2, "quantity": 1, "price": 29.99}
    ],
    "status": "pending"
  }'
```

**Order abrufen (mit Items):**

```bash
curl http://localhost:3000/api/orders/1
```

### Demo-Endpoints (Mock-Daten)

**User erstellen:**

```bash
curl -X POST http://localhost:3000/api/demo/users \
  -H "Content-Type: application/json" \
  -d '{"name":"John Doe","email":"john@example.com"}'
```

**Product erstellen:**

```bash
curl -X POST http://localhost:3000/api/demo/products \
  -H "Content-Type: application/json" \
  -d '{"name":"Monitor","price":299.99,"stock":20}'
```

**Order erstellen:**

```bash
curl -X POST http://localhost:3000/api/demo/orders \
  -H "Content-Type: application/json" \
  -d '{"userId":1,"items":[{"productId":1,"quantity":2}],"total":1999.98}'
```

## 🏗️ Architektur

```
Request → Logger Middleware
       → Router (routes/)
       → Controller (controllers/)
       → Service (services/)
       → Response / Error Handler
```

**Layers:**

-   **Routes**: Definieren HTTP-Endpunkte und binden Controller
    -   `/routes/db/*` - PostgreSQL-basierte Endpoints (`/api/*`)
    -   `/routes/demo/*` - Mock-basierte Endpoints (`/api/demo/*`)
-   **Controllers**: Verarbeiten Requests, Validierung, rufen Services auf
    -   `/controllers/db/*` - DB-Controller
    -   `/controllers/demo/*` - Mock-Controller
-   **Services**: Business Logic, Daten-Management
    -   `/services/db/*` - PostgreSQL-Services (echte DB-Queries)
    -   `/services/demo/*` - Mock-Services (In-Memory-Daten)
-   **Config**: Database Connection Pool (`/config/database.js`)
-   **Middleware**: Error Handler, Logger, etc.
-   **Utils**: Response-Helper für konsistente API-Responses

## 🔧 Environment Variables

Erstelle eine `.env` Datei im Root-Verzeichnis (siehe Beispiele oben im Quick Start).

### Verfügbare Variablen

| Variable            | Beschreibung                             | Standard                                                    | Beispiel                                          |
| ------------------- | ---------------------------------------- | ----------------------------------------------------------- | ------------------------------------------------- |
| `PORT`              | Server Port                              | `3000`                                                      | `3000`                                            |
| `NODE_ENV`          | Environment                              | `development`                                               | `production`                                      |
| `ALLOWED_ORIGINS`   | Erlaubte Frontend-URLs (komma-separiert) | -                                                           | `http://localhost:3000,https://app.com`           |
| `POSTGRES_USER`     | PostgreSQL Username                      | `postgres`                                                  | `postgres`                                        |
| `POSTGRES_PASSWORD` | PostgreSQL Passwort                      | `postgres`                                                  | `your_secure_password`                            |
| `POSTGRES_DB`       | PostgreSQL Datenbank-Name                | `lowcloud_db`                                               | `lowcloud_db`                                     |
| `POSTGRES_HOST`     | PostgreSQL Host                          | `localhost`                                                 | `localhost` (local) / `postgres` (Docker network) |
| `POSTGRES_PORT`     | PostgreSQL Port                          | `5433`                                                      | `5433`                                            |
| `DATABASE_URL`      | PostgreSQL Connection String             | `postgresql://postgres:postgres@localhost:5433/lowcloud_db` | -                                                 |

### CORS-Konfiguration

Das Backend verwendet CORS (Cross-Origin Resource Sharing), um Frontend-Zugriff von verschiedenen Domains zu ermöglichen.

**Development-Setup:**

```env
# Spezifische Localhost-Ports
ALLOWED_ORIGINS=http://localhost:3000,http://localhost:5173,http://localhost:8080

# ODER alle Origins erlauben (nur für Development!)
ALLOWED_ORIGINS=*
```

**Production-Setup:**

```env
# Nur explizite Frontend-URLs
ALLOWED_ORIGINS=https://frontend.example.com,https://app.example.com
```

**Wichtig:**

-   In Production niemals `ALLOWED_ORIGINS=*` verwenden!
-   Mehrere URLs mit Komma trennen (ohne Leerzeichen nach dem Komma)
-   URLs müssen exakt übereinstimmen (inkl. Protokoll und Port)

## 🗄️ Datenbank-Schema

Die Datenbank wird automatisch beim ersten Start initialisiert (`db/init.sql`):

### Tabellen

-   **users** - Benutzer-Daten

    -   `id` (SERIAL PRIMARY KEY)
    -   `username` (VARCHAR UNIQUE)
    -   `email` (VARCHAR UNIQUE)
    -   `created_at`, `updated_at`

-   **products** - Produkt-Katalog

    -   `id` (SERIAL PRIMARY KEY)
    -   `name`, `description`, `price`, `stock`
    -   `created_at`, `updated_at`

-   **orders** - Bestellungen

    -   `id` (SERIAL PRIMARY KEY)
    -   `user_id` (FK → users)
    -   `total_amount`, `status`
    -   `created_at`, `updated_at`

-   **order_items** - Bestellpositionen
    -   `id` (SERIAL PRIMARY KEY)
    -   `order_id` (FK → orders)
    -   `product_id` (FK → products)
    -   `quantity`, `price`
    -   `created_at`

### Datenbankzugriff im Code

```javascript
const db = require("./config/database");

// Einfaches Query
const result = await db.query("SELECT * FROM users WHERE id = $1", [userId]);

// Mit Connection Pool
const { rows } = await db.pool.query("SELECT * FROM products");
```

## 📦 Dependencies

-   `express` - Web Framework
-   `cors` - CORS Middleware
-   `dotenv` - Environment Variables
-   `pg` - PostgreSQL Client
-   `nodemon` - Development Hot-Reload (devDependency)

## 🚢 Deployment

Der Entry Point ist `src/index.js`. Stelle sicher, dass dein Deployment-Script diesen Pfad verwendet.

```bash
npm start
```
