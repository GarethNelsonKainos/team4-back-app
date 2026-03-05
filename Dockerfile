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

# Stage 3: production — Node.js + PostgreSQL in one container
FROM --platform=linux/amd64 node:20-alpine AS production
RUN apk add --no-cache openssl ca-certificates postgresql postgresql-client su-exec
RUN mkdir -p /var/lib/postgresql/data /run/postgresql && \
    chown -R postgres:postgres /var/lib/postgresql /run/postgresql
WORKDIR /app
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/src/generated ./src/generated
COPY prisma ./prisma
COPY prisma.config.ts ./
COPY tsconfig.json ./
COPY src ./src
COPY docker-entrypoint.sh /docker-entrypoint.sh
RUN chmod +x /docker-entrypoint.sh
EXPOSE 8080
ENV API_PORT=8080
ENV DATABASE_URL="postgresql://postgres:team4pass@127.0.0.1:5432/team4db"
CMD ["/docker-entrypoint.sh"]
