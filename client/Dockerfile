# ---- Stage 1: build ----
# Compiles the Vite/React app to static assets. This stage's node_modules
# and source never end up in the final image.
FROM node:20-alpine AS builder
WORKDIR /app

# Copy lockfile + package.json first so this layer is cached whenever only
# source files change, not dependencies.
COPY package*.json ./
RUN npm ci

COPY . .
# VITE_API_URL is baked into the static build at build time (Vite env vars
# are compile-time, not runtime) — pass it via --build-arg.
ARG VITE_API_URL
ENV VITE_API_URL=${VITE_API_URL}
RUN npm run build

# ---- Stage 2: runtime ----
# Final image is just nginx + static files — no Node, no source, no
# node_modules. Typically ~25MB vs. several hundred MB for a Node-based image.
FROM nginx:1.27-alpine AS runtime
COPY --from=builder /app/dist /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80
HEALTHCHECK --interval=30s --timeout=3s CMD wget -qO- http://localhost/ || exit 1
CMD ["nginx", "-g", "daemon off;"]
