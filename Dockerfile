# Use Node.js 22.14.0 official image as base
FROM node:22.14.0

# Set working directory
WORKDIR /app

# Copy package.json and install dependencies
COPY package.json package-lock.json ./
RUN npm install

# Copy application files
COPY . .

# Build the React app
RUN npm run build

# Expose the frontend port
EXPOSE 3000

# Serve the React build using a simple HTTP server
CMD ["npx", "serve", "-s", "build", "-l", "3000"]
