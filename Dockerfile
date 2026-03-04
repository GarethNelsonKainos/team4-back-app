FROM node:20-alpine AS production

# Install runtime dependencies in one layer
RUN apk add --no-cache openssl libc6-compat && \
    npm config set strict-ssl false

# Create non-root user early (before copying files)
RUN addgroup -g 1001 -S nodejs && \
    adduser -S nodejs -u 1001 -G nodejs

WORKDIR /app

# Change ownership of working directory
RUN chown nodejs:nodejs /app

# Switch to non-root user before installing dependencies
USER nodejs

# Set NODE_ENV to production (ensures only production deps are installed)
ENV NODE_ENV=production

# Copy package files and Prisma schema
COPY --chown=nodejs:nodejs package*.json ./
COPY --chown=nodejs:nodejs prisma ./prisma/

# Install production dependencies, tsx for runtime, generate Prisma client, and clean up
ENV NODE_TLS_REJECT_UNAUTHORIZED=0
RUN npm ci --omit=dev --ignore-scripts && \
    npm install tsx --no-save && \
    npx prisma generate && \
    rm -rf node_modules/prisma node_modules/@prisma/dev node_modules/typescript \
           node_modules/@types node_modules/react-dom node_modules/@electric-sql \
           node_modules/effect node_modules/remeda node_modules/lodash \
           node_modules/fast-check node_modules/@biomejs && \
    npm cache clean --force && \
    rm -rf ~/.npm /tmp/*
ENV NODE_TLS_REJECT_UNAUTHORIZED=1

# Copy source code
COPY --chown=nodejs:nodejs src ./src

# Expose the port your app runs on
EXPOSE 8080

# Health check (optional but recommended)
HEALTHCHECK --interval=30s --timeout=3s --start-period=10s --retries=3 \
  CMD node -e "require('http').get('http://localhost:8080/health', (r) => {process.exit(r.statusCode === 200 ? 0 : 1)})"

# Start the application with tsx
CMD ["npx", "tsx", "src/index.ts"]
