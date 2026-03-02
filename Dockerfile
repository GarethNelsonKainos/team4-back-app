FROM node:20-alpine
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
ENV DATABASE_URL="postgresql://dummy:dummy@localhost:5432/dummy"
RUN NODE_TLS_REJECT_UNAUTHORIZED=0 npx prisma generate
EXPOSE 8080
CMD ["npm", "run", "dev"]