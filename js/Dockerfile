# ── Stage 1: Builder ─────────────────────────────────────────────────────────
FROM node:22-alpine AS builder
WORKDIR /app

COPY package*.json ./
RUN npm ci --ignore-scripts

COPY tsconfig*.json ./
COPY src/ ./src/
RUN npm run build

# ── Stage 2: Production ───────────────────────────────────────────────────────
FROM node:22-alpine AS production
WORKDIR /app

RUN addgroup --system --gid 1001 nodejs \
    && adduser --system --uid 1001 fastify

COPY package*.json ./
RUN npm ci --omit=dev --ignore-scripts && npm cache clean --force

COPY --from=builder --chown=fastify:nodejs /app/dist ./dist
COPY --chown=fastify:nodejs drizzle/ ./drizzle/
COPY --chown=fastify:nodejs entrypoint.sh ./entrypoint.sh
COPY --chown=fastify:nodejs scripts/ ./scripts/
RUN chmod +x entrypoint.sh scripts/*.sh

USER fastify

EXPOSE 8000

ENTRYPOINT ["./entrypoint.sh"]
