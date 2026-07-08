# ---- Stage 1: Build ----
FROM node:20-alpine AS builder

WORKDIR /app

ARG VITE_API_GATEWAY_URL=http://localhost:1111

# Copy package files first for better layer caching
COPY package.json package-lock.json ./

RUN npm ci

ENV VITE_API_GATEWAY_URL=${VITE_API_GATEWAY_URL}

# Copy source code
COPY . .

# Build production bundle
RUN npm run build

# ---- Stage 2: Serve ----
FROM nginx:stable-alpine

ARG API_GATEWAY_URL=https://localhost

# Remove default nginx config
RUN rm /etc/nginx/conf.d/default.conf

# Copy custom nginx config
COPY nginx.conf /etc/nginx/conf.d/default.conf

RUN sed -i "s|__API_GATEWAY_URL__|${API_GATEWAY_URL}|g" /etc/nginx/conf.d/default.conf

# Copy built assets from builder stage
COPY --from=builder /app/dist /usr/share/nginx/html

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
