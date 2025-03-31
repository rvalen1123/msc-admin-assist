# syntax=docker/dockerfile:1

# Stage 1: Build the application
FROM node:22.13.1-slim AS builder

# Set the working directory
WORKDIR /app

# Copy package.json and package-lock.json for dependency installation
COPY package*.json ./

# Install dependencies
RUN --mount=type=cache,target=/root/.npm npm ci

# Copy the application source code
COPY . .

# Build the application
RUN npm run build

# Stage 2: Create the production image
FROM node:22.13.1-slim AS production

# Set the working directory
WORKDIR /app

# Copy only the necessary files from the builder stage
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/package*.json ./

# Set environment variables
ENV NODE_ENV=production

# Expose the application port
EXPOSE 3000

# Run the application
CMD ["node", "dist/main.js"]