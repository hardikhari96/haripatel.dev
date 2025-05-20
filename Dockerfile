# ===== Build Stage =====
FROM node:18-alpine AS builder

# Set working directory
WORKDIR /app

# Copy package files
COPY package*.json ./

# Install only production dependencies
RUN npm install

# Copy source code
COPY . .

# Build the application
RUN npm run build

# ===== Production Stage =====
FROM nginx:alpine

# Set working directory for Nginx
WORKDIR /usr/share/nginx/html

# Remove default Nginx website
RUN rm -rf ./*

# Copy built app and data directory from builder
COPY --from=builder /app/dist .
COPY --from=builder /app/src/data ./data

# Copy custom Nginx configuration
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Expose HTTP port
EXPOSE 80

# Optional: Healthcheck (remove if not needed)
HEALTHCHECK --interval=30s --timeout=5s \
  CMD wget --spider -q http://localhost || exit 1

# Start Nginx
CMD ["nginx", "-g", "daemon off;"]

# Image metadata
LABEL org.opencontainers.image.title="haripatel-dev-v2"
LABEL org.opencontainers.image.description="Frontend application for haripatel-dev-v2"
LABEL org.opencontainers.image.version="1.0.0"
