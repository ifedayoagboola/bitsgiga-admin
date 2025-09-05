# ---------- Build ----------
    FROM node:20-alpine AS build
    WORKDIR /app
    
    COPY package*.json ./
    RUN npm ci
    
    COPY . .
    # CRA/Angular typically:
    RUN rm -rf build && npm run build
    
    # ---------- Runtime ----------
    FROM nginx:1.27-alpine
    
    RUN apk add --no-cache curl
    RUN rm -f /etc/nginx/conf.d/default.conf
    COPY nginx.conf /etc/nginx/conf.d/default.conf
    
    # CRA/Angular build output is /build
    COPY --from=build /app/build /usr/share/nginx/html
    
    HEALTHCHECK --interval=15s --timeout=3s --retries=5 \
    CMD wget -qO- http://localhost/healthz >/dev/null 2>&1 || exit 1
    