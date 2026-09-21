# ==========================================
# Multi-Stage Dockerfile for House of Engineers
# ==========================================

# Stage 1: Build Client Frontend
FROM node:20-alpine AS client-builder
WORKDIR /app/client

COPY client/package*.json ./
RUN npm ci

COPY client/ ./
RUN npm run build

# Stage 2: Production Server
FROM node:20-alpine AS runner
WORKDIR /app

ENV NODE_ENV=production
ENV PORT=5000

# Copy server package manifests and install production dependencies
COPY server/package*.json ./server/
WORKDIR /app/server
RUN npm ci --only=production

# Copy server application source
COPY server/ ./

# Copy compiled client build from Stage 1 into /app/client/dist
COPY --from=client-builder /app/client/dist /app/client/dist

EXPOSE 5000

CMD ["node", "server.js"]
