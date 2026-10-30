# ===================================
# VikingsERP Backend Dockerfile
# ===================================
FROM node:20-alpine

WORKDIR /app

# Copy package files and install dependencies
COPY package*.json ./
RUN npm install

# Copy application source
COPY . .

# Expose backend port
EXPOSE 5000

# Start with nodemon for development
CMD ["npm", "run", "dev"]
