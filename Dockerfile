# syntax=docker/dockerfile:1
FROM node:20-alpine

# Install dependencies for better file watching
RUN apk add --no-cache bash gcompat

WORKDIR /app

# Copy root package manifests and workspaces manifests
COPY package*.json ./
COPY apps/backend/package*.json ./apps/backend/
COPY apps/frontend/package*.json ./apps/frontend/
COPY packages/shared/package*.json ./packages/shared/

# Install dependencies
RUN npm ci --legacy-peer-deps

# Copy the rest of the source code
COPY . .

EXPOSE 4000 5173

CMD ["npm", "run", "dev"] 