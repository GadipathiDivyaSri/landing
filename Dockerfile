# Production Dockerfile for WrindhaOS
FROM node:20-alpine AS runner

WORKDIR /app

ENV NODE_ENV=production

# Copy package descriptors
COPY package*.json ./

# Install production dependencies
RUN npm install --omit=dev

# Copy application source
COPY . .

# Expose default port
EXPOSE 3000

# Use non-root node user for container security
USER node

# Health check probe
HEALTHCHECK --interval=30s --timeout=5s --start-period=5s --retries=3 \
  CMD wget --no-verbose --tries=1 --spider http://localhost:3000/health || exit 1

CMD ["node", "server.js"]
