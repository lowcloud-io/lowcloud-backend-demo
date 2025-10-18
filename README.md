# LowCloud Backend Demo

Express.js Backend mit Layered Architecture (Router → Controller → Service)

## 🚀 Quick Start

```bash
# Dependencies installieren
npm install

# Development-Server mit Hot-Reload
npm run dev

# Production-Server
npm start
```

Der Server läuft standardmäßig auf `http://localhost:3000`

## 📁 Projektstruktur

```
/src
  /routes       → Router-Definitionen (HTTP-Routen)
  /controllers  → Request-Handler (Business Logic)
  /services     → Geschäftslogik / Data Access
  /middleware   → Custom Middleware (Error Handler, Logging)
  /utils        → Hilfsfunktionen
  index.js      → Entry Point
```

## 🔌 API-Endpunkte

### Root

- `GET /` - API-Übersicht

### Health Check

- `GET /api/health` - Status des Servers

### Users

- `GET /api/users` - Alle Users
- `GET /api/users/:id` - User by ID
- `POST /api/users` - User erstellen
- `PUT /api/users/:id` - User aktualisieren
- `DELETE /api/users/:id` - User löschen

### Products

- `GET /api/products` - Alle Products
- `GET /api/products/:id` - Product by ID
- `POST /api/products` - Product erstellen
- `PUT /api/products/:id` - Product aktualisieren
- `DELETE /api/products/:id` - Product löschen

### Orders

- `GET /api/orders` - Alle Orders
- `GET /api/orders/:id` - Order by ID
- `POST /api/orders` - Order erstellen
- `PUT /api/orders/:id` - Order aktualisieren
- `DELETE /api/orders/:id` - Order löschen

## 📝 Beispiel-Requests

### User erstellen

```bash
curl -X POST http://localhost:3000/api/users \
  -H "Content-Type: application/json" \
  -d '{"name":"John Doe","email":"john@example.com"}'
```

### Product erstellen

```bash
curl -X POST http://localhost:3000/api/products \
  -H "Content-Type: application/json" \
  -d '{"name":"Monitor","price":299.99,"stock":20}'
```

### Order erstellen

```bash
curl -X POST http://localhost:3000/api/orders \
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

- **Routes**: Definieren HTTP-Endpunkte und binden Controller
- **Controllers**: Verarbeiten Requests, Validierung, rufen Services auf
- **Services**: Business Logic, Daten-Management (aktuell Mock-Daten)
- **Middleware**: Error Handler, Logger, etc.
- **Utils**: Response-Helper für konsistente API-Responses

## 🔧 Environment Variables

Erstelle eine `.env` Datei im Root-Verzeichnis:

```env
# Server Configuration
PORT=3000
NODE_ENV=development

# CORS - Allowed Frontend URLs (comma-separated)
ALLOWED_ORIGINS=http://localhost:3000,http://localhost:5173
```

### Verfügbare Variablen

| Variable          | Beschreibung                             | Standard      | Beispiel                                |
| ----------------- | ---------------------------------------- | ------------- | --------------------------------------- |
| `PORT`            | Server Port                              | `3000`        | `3000`                                  |
| `NODE_ENV`        | Environment                              | `development` | `production`                            |
| `ALLOWED_ORIGINS` | Erlaubte Frontend-URLs (komma-separiert) | -             | `http://localhost:3000,https://app.com` |

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

- In Production niemals `ALLOWED_ORIGINS=*` verwenden!
- Mehrere URLs mit Komma trennen (ohne Leerzeichen nach dem Komma)
- URLs müssen exakt übereinstimmen (inkl. Protokoll und Port)

## 📦 Dependencies

- `express` - Web Framework
- `cors` - CORS Middleware
- `dotenv` - Environment Variables
- `nodemon` - Development Hot-Reload (devDependency)

## 🚢 Deployment

Der Entry Point ist `src/index.js`. Stelle sicher, dass dein Deployment-Script diesen Pfad verwendet.

```bash
npm start
```
