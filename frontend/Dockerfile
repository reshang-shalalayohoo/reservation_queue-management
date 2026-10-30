# ===================================
# VikingsERP Frontend Dockerfile
# ===================================
FROM node:20-alpine

WORKDIR /app

# Copy package files and install dependencies
COPY package*.json ./
RUN npm install

# Copy application source
COPY . .

# Expose Vite dev server port
EXPOSE 5173

# Start Vite dev server with host binding for Docker access
CMD ["npx", "vite", "--host", "0.0.0.0"]
