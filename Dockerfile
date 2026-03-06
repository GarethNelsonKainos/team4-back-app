FROM node:20-alpine AS builder

RUN apk add --no-cache openssl libc6-compat

WORKDIR /app

# Prisma v7 reads DATABASE_URL from prisma.config.ts during generate.
# Use a non-secret placeholder for build-time commands.
ARG DATABASE_URL=postgresql://postgres:postgres@localhost:5432/postgres
ENV DATABASE_URL=${DATABASE_URL}

# Allow skipping prisma generate if it's already cached
ARG RUN_PRISMA_GENERATE=true

COPY package*.json ./
COPY tsconfig.json ./
COPY prisma.config.ts ./
COPY prisma ./prisma/
COPY src ./src/

RUN npm ci
RUN if [ "$RUN_PRISMA_GENERATE" = "true" ]; then npx prisma generate; else echo "Skipping prisma generate"; fi
RUN npm run build


FROM node:20-alpine AS production

RUN apk add --no-cache openssl libc6-compat

RUN addgroup -g 1001 -S nodejs && \
    adduser -S nodejs -u 1001 -G nodejs

WORKDIR /app

ENV NODE_ENV=production
ENV API_PORT=8080

# Keep a fallback value so Prisma CLI can start; deployment env should override this.
ARG DATABASE_URL=postgresql://postgres:postgres@localhost:5432/postgres
ENV DATABASE_URL=${DATABASE_URL}

COPY --chown=nodejs:nodejs package*.json ./
COPY --chown=nodejs:nodejs prisma.config.ts ./
COPY --chown=nodejs:nodejs prisma ./prisma/

RUN npm ci --omit=dev

COPY --from=builder --chown=nodejs:nodejs /app/dist ./dist
COPY --from=builder --chown=nodejs:nodejs /app/src/generated ./src/generated
COPY --from=builder --chown=nodejs:nodejs /app/src ./src

USER nodejs

EXPOSE 8080

HEALTHCHECK --interval=30s --timeout=3s --start-period=10s --retries=3 \
  CMD node -e "require('http').get('http://localhost:8080/health', (r) => {process.exit(r.statusCode === 200 ? 0 : 1)})"

CMD ["sh", "-c", "npx prisma migrate deploy && (npx tsx prisma/seed.ts || true) && exec node dist/index.js"]
