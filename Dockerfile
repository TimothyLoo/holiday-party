# Dockerfile for Next.js (PWA-ready) development
FROM node:current-alpine

# Set working directory
WORKDIR /app

# Install dependencies
COPY package.json .
RUN npm install

# Expose port
EXPOSE 4444

# Start the development server
CMD ["npm", "run", "dev"]
