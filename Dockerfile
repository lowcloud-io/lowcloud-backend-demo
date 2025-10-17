FROM node:18-alpine

WORKDIR /app

# Dependencies installieren
COPY package*.json ./
RUN npm ci --production --silent

# Anwendungscode kopieren
COPY src/ ./src/

# Non-root User verwenden für Sicherheit
USER node

# Port exponieren
EXPOSE 3000

# Health check
HEALTHCHECK --interval=30s --timeout=3s --start-period=10s \
  CMD node -e "require('http').get('http://localhost:3000/api/health', (r) => {process.exit(r.statusCode === 200 ? 0 : 1)})"

# Anwendung starten
CMD ["node", "src/index.js"]
