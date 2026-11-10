# ==========================================
# 7Days OS - Backend Production Dockerfile
# Multi-stage build for Express & PostgreSQL
# ==========================================

# 1. Dependencies & Builder Stage
FROM node:20-alpine AS builder
WORKDIR /app

COPY package*.json ./
COPY apps/backend/package*.json ./apps/backend/
COPY packages/shared-types/package*.json ./packages/shared-types/

RUN npm ci

COPY . .

RUN npm run build --workspace=@7days/shared-types
RUN npm run build --workspace=@7days/backend

# 2. Production Runner Stage
FROM node:20-alpine AS runner
WORKDIR /app

ENV NODE_ENV=production
ENV PORT=4000

RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 backenduser

COPY --from=builder /app/apps/backend/dist ./dist
COPY --from=builder /app/packages/shared-types/dist ./node_modules/@7days/shared-types/dist
COPY --from=builder /app/packages/shared-types/package.json ./node_modules/@7days/shared-types/package.json
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/apps/backend/package.json ./package.json

USER backenduser

EXPOSE 4000

CMD ["node", "dist/index.js"]
