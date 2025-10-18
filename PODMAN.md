# Podman Befehle für LowCloud Backend

## 📦 Image bauen

```bash
# Einfaches Build
podman build -t lowcloud-backend:latest .

# Build mit spezifischem Tag
podman build -t lowcloud-backend:1.0.0 .

# Build mit Build-Args (falls benötigt)
podman build --build-arg NODE_ENV=production -t lowcloud-backend:latest .
```

## 🚀 Container starten

```bash
# Standard-Start (Port 3000 → 3000)
podman run -d \
  --name lowcloud-backend \
  -p 3000:3000 \
  lowcloud-backend:latest

# Mit Environment Variables
podman run -d \
  --name lowcloud-backend \
  -p 3000:3000 \
  -e PORT=3000 \
  -e NODE_ENV=production \
  lowcloud-backend:latest

# Mit CORS-Konfiguration (wichtig für Frontend-Zugriff!)
podman run -d \
  --name lowcloud-backend \
  -p 3000:3000 \
  -e NODE_ENV=production \
  -e ALLOWED_ORIGINS="https://frontend.example.com,https://app.example.com" \
  lowcloud-backend:latest

# Development-Setup mit lokalem Frontend
podman run -d \
  --name lowcloud-backend \
  -p 3000:3000 \
  -e NODE_ENV=development \
  -e ALLOWED_ORIGINS="http://localhost:3000,http://localhost:5173" \
  lowcloud-backend:latest

# Development: Alle Origins erlauben (nur für Testing!)
podman run -d \
  --name lowcloud-backend \
  -p 3000:3000 \
  -e ALLOWED_ORIGINS="*" \
  lowcloud-backend:latest

# Mit Volume für Logs (optional)
podman run -d \
  --name lowcloud-backend \
  -p 3000:3000 \
  -v ./logs:/app/logs:z \
  lowcloud-backend:latest

# Im Vordergrund (für Debugging)
podman run --rm \
  --name lowcloud-backend \
  -p 3000:3000 \
  lowcloud-backend:latest
```

## 🔧 Container-Management

```bash
# Container stoppen
podman stop lowcloud-backend

# Container starten (wenn bereits erstellt)
podman start lowcloud-backend

# Container neu starten
podman restart lowcloud-backend

# Container löschen
podman rm lowcloud-backend

# Container löschen (erzwingen, auch wenn läuft)
podman rm -f lowcloud-backend
```

## 📊 Monitoring & Logs

```bash
# Logs anzeigen
podman logs lowcloud-backend

# Logs live verfolgen
podman logs -f lowcloud-backend

# Letzte 50 Zeilen
podman logs --tail 50 lowcloud-backend

# Container-Status
podman ps

# Alle Container (auch gestoppte)
podman ps -a

# Container-Ressourcen
podman stats lowcloud-backend

# Health-Check Status
podman inspect lowcloud-backend | grep -A 5 Health
```

## 🔍 Debugging

```bash
# Shell im laufenden Container öffnen
podman exec -it lowcloud-backend sh

# Einzelnen Befehl im Container ausführen
podman exec lowcloud-backend node -v

# Inspect Container Details
podman inspect lowcloud-backend
```

## 🧹 Cleanup

```bash
# Image löschen
podman rmi lowcloud-backend:latest

# Alle gestoppten Container löschen
podman container prune

# Alle ungenutzten Images löschen
podman image prune

# Alles aufräumen (Container, Images, Volumes, Networks)
podman system prune -a
```

## 🔄 Update Workflow

```bash
# 1. Neues Image bauen
podman build -t lowcloud-backend:latest .

# 2. Alten Container stoppen und entfernen
podman stop lowcloud-backend
podman rm lowcloud-backend

# 3. Neuen Container starten
podman run -d \
  --name lowcloud-backend \
  -p 3000:3000 \
  lowcloud-backend:latest
```

## 🌐 Netzwerk & Ports

```bash
# Auf anderem Port starten (z.B. 8080)
podman run -d \
  --name lowcloud-backend \
  -p 8080:3000 \
  lowcloud-backend:latest

# Mit Custom Network
podman network create lowcloud-net
podman run -d \
  --name lowcloud-backend \
  --network lowcloud-net \
  -p 3000:3000 \
  lowcloud-backend:latest
```

## 🏷️ Image-Management

```bash
# Alle Images anzeigen
podman images

# Image taggen
podman tag lowcloud-backend:latest lowcloud-backend:1.0.0

# Image zu Registry pushen (optional)
podman push lowcloud-backend:latest registry.example.com/lowcloud-backend:latest

# Image speichern (für Backup)
podman save -o lowcloud-backend.tar lowcloud-backend:latest

# Image laden (von Backup)
podman load -i lowcloud-backend.tar
```

## ✅ Quick Test

```bash
# Nach dem Start, API testen:
curl http://localhost:3000/
curl http://localhost:3000/api/health
curl http://localhost:3000/api/users
```

## 🔐 Rootless Podman

Podman läuft standardmäßig rootless. Falls du Root-Rechte brauchst:

```bash
# Als Root ausführen
sudo podman run -d --name lowcloud-backend -p 3000:3000 lowcloud-backend:latest
```

## 🌐 CORS-Konfiguration für Multi-Frontend-Setup

### Beispiel: Mehrere Frontends

```bash
# Production mit 3 verschiedenen Frontends
podman run -d \
  --name lowcloud-backend \
  -p 3000:3000 \
  -e NODE_ENV=production \
  -e ALLOWED_ORIGINS="https://web.example.com,https://app.example.com,https://admin.example.com" \
  lowcloud-backend:latest
```

### Environment-File verwenden

Erstelle eine Datei `.env.production`:

```env
PORT=3000
NODE_ENV=production
ALLOWED_ORIGINS=https://frontend.com,https://app.com
```

Dann starte mit:

```bash
podman run -d \
  --name lowcloud-backend \
  -p 3000:3000 \
  --env-file .env.production \
  lowcloud-backend:latest
```

### CORS-Probleme debuggen

```bash
# Logs anschauen für CORS-Fehler
podman logs -f lowcloud-backend

# Shell öffnen und ENV-Variablen prüfen
podman exec -it lowcloud-backend sh
echo $ALLOWED_ORIGINS
```

## 📝 Tipps

1. **--rm Flag**: Container automatisch nach Stop löschen
2. **-d Flag**: Detached mode (im Hintergrund)
3. **-it Flags**: Interaktiv mit TTY (für Shell-Zugriff)
4. **:z Flag bei Volumes**: SELinux-Label für Zugriff (wichtig auf Fedora/RHEL)
5. **CORS in Production**: Immer explizite URLs angeben, niemals `*`
