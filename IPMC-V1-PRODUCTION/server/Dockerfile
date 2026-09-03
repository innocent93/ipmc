# ---- Stage 1: dependencies ----
# Installed separately so this layer is cached whenever only source files
# change, and so dev dependencies never reach the final image.
FROM node:20-alpine AS deps
WORKDIR /app
COPY package*.json ./
RUN npm ci --omit=dev

# ---- Stage 2: runtime ----
FROM node:20-alpine AS runtime
WORKDIR /app

# Run as a non-root user rather than the image's default root — standard
# hardening for anything internet-facing.
RUN addgroup -S ipmc && adduser -S ipmc -G ipmc

COPY --from=deps /app/node_modules ./node_modules
COPY . .

# Uploaded files (if not using Cloudinary) need a writable, persistent dir
RUN mkdir -p /app/uploads && chown -R ipmc:ipmc /app

USER ipmc
ENV NODE_ENV=production
EXPOSE 5000

HEALTHCHECK --interval=30s --timeout=5s --start-period=10s \
  CMD node -e "require('http').get('http://localhost:5000/api/services', r => process.exit(r.statusCode < 500 ? 0 : 1)).on('error', () => process.exit(1))"

CMD ["node", "server.js"]
