# Dockerfile for Next.js (PWA-ready) development
FROM node:current-alpine

# Install git and bash
RUN apk add --no-cache git bash

# Set working directory
WORKDIR /app

# Install dependencies
COPY package.json .
RUN npm install

COPY . .

# Expose port
EXPOSE 4444

# Start the development server
CMD ["npm", "run", "dev"]
