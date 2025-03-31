# Stage 1: Build the application
FROM node:22-alpine AS build

# Set working directory
WORKDIR /app

# Copy package files
COPY package*.json ./
COPY tsconfig*.json ./
COPY prisma ./prisma/

# Install dependencies including Prisma
RUN npm ci

# Copy application code
COPY . .

# Build application
RUN npm run build

# Generate Prisma client
RUN npx prisma generate

# Stage 2: Create production image
FROM node:22-alpine AS production

# Set environment variables
ENV NODE_ENV=production
ENV PORT=3000

# Set working directory
WORKDIR /app

# Copy package files
COPY package*.json ./
COPY --from=build /server/dist ./dist
COPY --from=build /server/node_modules/.prisma ./node_modules/.prisma
COPY --from=build /server/node_modules/@prisma ./node_modules/@prisma
COPY --from=build /server/prisma ./prisma

# Install production dependencies
RUN npm ci --production

# Expose port
EXPOSE 3000

# Run the application
CMD ["node", "dist/src/main.js"]
