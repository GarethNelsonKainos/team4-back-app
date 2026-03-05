# Build stage
FROM node:20-alpine3.20 AS builder

WORKDIR /app

# Install system certificates for Prisma engine downloads
RUN apk add --no-cache ca-certificates

# Install dependencies
COPY package.json package-lock.json* ./
RUN npm ci

# Copy source and build
COPY tsconfig.json ./
COPY prisma.config.ts ./
COPY prisma ./prisma
COPY scripts ./scripts
COPY src ./src
ARG PRISMA_DISABLE_TLS_VERIFY=0
RUN if [ "$PRISMA_DISABLE_TLS_VERIFY" = "1" ]; then \
	NODE_TLS_REJECT_UNAUTHORIZED=0 npx prisma generate; \
else \
	npx prisma generate; \
fi
RUN npm run build
# Post-process compiled JS to add .js extensions to Prisma imports/exports so ESM resolution works
RUN find dist/generated -name "*.js" -type f -exec sed -i "s|from '\(\./[^']*\)'|from '\1.js'|g; s|from \"\(\./[^\"]*\)\"|from \"\1.js\"|g; s|\.js\.js|.js|g" {} +
# Copy Prisma client JS files into dist so runtime ESM imports resolve
RUN mkdir -p dist/generated && cp -R src/generated/. dist/generated/

# Runtime stage
FROM node:20-alpine3.20 AS runner

WORKDIR /app
ENV NODE_ENV=production

# Install system certificates and create non-root user
RUN apk add --no-cache ca-certificates \
	&& addgroup -S appgroup \
	&& adduser -S appuser -G appgroup

# Install production dependencies
COPY --chown=appuser:appgroup package.json package-lock.json* ./
RUN npm ci --omit=dev --no-audit --no-fund \
	&& npm cache clean --force \
	&& rm -rf /root/.npm /home/appuser/.npm

# Copy built output and Prisma assets with correct ownership
COPY --chown=appuser:appgroup --from=builder /app/dist ./dist
COPY --chown=appuser:appgroup --from=builder /app/prisma ./prisma
COPY --chown=appuser:appgroup --from=builder /app/prisma.config.ts ./
COPY --chown=appuser:appgroup entrypoint.sh ./
COPY --chown=appuser:appgroup healthcheck.sh ./

# Set permissions and switch to non-root user
RUN chmod +x ./entrypoint.sh ./healthcheck.sh \
	&& chmod 755 /app
USER appuser

# Health check
HEALTHCHECK --interval=30s --timeout=5s --start-period=10s --retries=3 \
	CMD ./healthcheck.sh

EXPOSE 8080
ENTRYPOINT ["./entrypoint.sh"]
CMD ["node", "--experimental-specifier-resolution=node", "dist/index.js"]
