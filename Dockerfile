# Stage 1: install dependencies
FROM node:20-alpine AS deps
RUN apk add --no-cache openssl ca-certificates
WORKDIR /app
COPY package.json package-lock.json ./
RUN npm ci

# Stage 2: runtime image (only what's needed to run)
FROM node:20-alpine AS runtime
RUN apk add --no-cache openssl ca-certificates
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY prisma ./prisma
COPY prisma.config.ts ./
COPY tsconfig.json ./
COPY src ./src

EXPOSE 3000

CMD ["sh", "-c", "NODE_TLS_REJECT_UNAUTHORIZED=0 npx prisma migrate deploy && npx tsx src/index.ts"]
