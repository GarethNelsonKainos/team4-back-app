FROM node:20-alpine AS deps
WORKDIR /app
COPY package*.json ./
RUN npm ci

FROM node:20-alpine AS runtime
WORKDIR /app
ENV NODE_ENV=production
ENV DATABASE_URL="postgresql://dummy:dummy@localhost:5432/dummy"

COPY package*.json ./
COPY prisma ./prisma
COPY --from=deps /app/node_modules ./node_modules
RUN NODE_TLS_REJECT_UNAUTHORIZED=0 npx prisma generate

COPY src ./src
COPY tsconfig.json .

EXPOSE 8080
CMD ["npx", "tsx", "src/index.ts"]