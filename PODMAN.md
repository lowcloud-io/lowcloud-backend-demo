# Podman Quick Reference – LowCloud Backend

## 📦 Image bauen

```bash
podman build -t lowcloud-backend:latest .
```

## 🚀 Container starten

```bash
# Standard-Start
podman run -d --name lowcloud-backend -p 3000:3000 lowcloud-backend:latest

# Mit Environment Variables (Production)
podman run -d \
  --name lowcloud-backend \
  -p 3000:3000 \
  -e NODE_ENV=production \
  -e ALLOWED_ORIGINS="https://frontend.example.com,https://app.example.com" \
  lowcloud-backend:latest

# Development (Alle Origins erlauben)
podman run -d \
  --name lowcloud-backend \
  -p 3000:3000 \
  -e ALLOWED_ORIGINS="*" \
  lowcloud-backend:latest

# Mit Environment-File
podman run -d --name lowcloud-backend -p 3000:3000 --env-file .env.production lowcloud-backend:latest
```

## 🔧 Container-Management

```bash
podman stop lowcloud-backend      # Stoppen
podman start lowcloud-backend     # Starten
podman restart lowcloud-backend   # Neu starten
podman rm lowcloud-backend        # Löschen
podman rm -f lowcloud-backend     # Löschen (erzwingen)
```

## 📊 Logs & Status

```bash
podman logs lowcloud-backend           # Logs anzeigen
podman logs -f lowcloud-backend        # Logs live verfolgen
podman logs --tail 50 lowcloud-backend # Letzte 50 Zeilen
podman ps                              # Laufende Container
podman ps -a                           # Alle Container
podman stats lowcloud-backend          # Ressourcen-Monitoring
```

## 🔍 Debugging

```bash
podman exec -it lowcloud-backend sh    # Shell öffnen
podman exec lowcloud-backend node -v   # Befehl ausführen
podman inspect lowcloud-backend        # Container-Details
```

## 🔄 Update Workflow

```bash
# 1. Neues Image bauen
podman build -t lowcloud-backend:latest .

# 2. Container stoppen & entfernen
podman stop lowcloud-backend && podman rm lowcloud-backend

# 3. Neu starten
podman run -d --name lowcloud-backend -p 3000:3000 lowcloud-backend:latest
```

## 🧹 Cleanup

```bash
podman rmi lowcloud-backend:latest  # Image löschen
podman container prune              # Gestoppte Container löschen
podman image prune                  # Ungenutzte Images löschen
podman system prune -a              # Alles aufräumen
```

## ✅ Quick Test

```bash
curl http://localhost:3000/
curl http://localhost:3000/api/health
curl http://localhost:3000/api/users
```

## 📝 Tipps

- **-d**: Detached (im Hintergrund)
- **--rm**: Container nach Stop automatisch löschen
- **-it**: Interaktiv mit Shell
- **CORS Production**: Niemals `*` verwenden, immer explizite URLs
