# Stage 1: builder — install deps and generate Prisma client
FROM --platform=linux/amd64 node:20-alpine AS builder
RUN apk add --no-cache openssl ca-certificates
WORKDIR /app
COPY package.json package-lock.json ./
RUN npm ci
COPY prisma ./prisma
COPY prisma.config.ts ./
COPY tsconfig.json ./
COPY src ./src
RUN DATABASE_URL="postgresql://placeholder:placeholder@localhost:5432/placeholder" npx prisma generate

# Stage 2: development
FROM --platform=linux/amd64 node:20-alpine AS development
RUN apk add --no-cache openssl ca-certificates
WORKDIR /app
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/src/generated ./src/generated
COPY prisma ./prisma
COPY prisma.config.ts ./
COPY tsconfig.json ./
COPY src ./src
EXPOSE 8080
ENV API_PORT=8080
CMD ["npx", "tsx", "src/index.ts"]

# Stage 3: production
FROM --platform=linux/amd64 node:20-alpine AS production
RUN apk add --no-cache openssl ca-certificates
WORKDIR /app
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/src/generated ./src/generated
COPY prisma ./prisma
COPY prisma.config.ts ./
COPY tsconfig.json ./
COPY src ./src
EXPOSE 8080
ENV API_PORT=8080
CMD ["sh", "-c", "npx prisma migrate deploy && npx tsx src/index.ts"]
