# syntax=docker/dockerfile:1

# Use Node 18 (stable for CRA ecosystems)
FROM node:18-bullseye AS build
WORKDIR /app

# Speed + fewer noisy logs
ENV NPM_CONFIG_FUND=false \
    NPM_CONFIG_AUDIT=false \
    CI=true

COPY package*.json ./

# Use CI if lockfile exists, otherwise fallback to install
# legacy-peer-deps avoids ERESOLVE pinches in older trees
RUN if [ -f package-lock.json ]; then \
      npm ci --legacy-peer-deps; \
    else \
      npm install --legacy-peer-deps; \
    fi

COPY . .
# CRA outputs to ./build
RUN npm run build

# ---- serve static with nginx ----
FROM nginx:1.25-alpine
COPY --from=build /app/build /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d/default.conf
HEALTHCHECK --interval=15s --timeout=3s --retries=5 \
  CMD wget -qO- http://localhost/healthz >/dev/null 2>&1 || exit 1
