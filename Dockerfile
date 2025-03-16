# Use Node.js for building React
FROM node:22.14.0 AS build

# Set working directory
WORKDIR /app

# Copy package.json and install dependencies
COPY package*.json ./
RUN npm install

# Copy the entire app and build it
COPY . .
ARG REACT_APP_BACKEND_URL
ENV REACT_APP_BACKEND_URL=${REACT_APP_BACKEND_URL}
RUN npm run build

# Use Nginx as the web server
FROM nginx:alpine

# Copy built React app to Nginx HTML folder
COPY --from=build /app/build /usr/share/nginx/html

# Remove default Nginx config
RUN rm /etc/nginx/conf.d/default.conf

# Add custom Nginx config
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Expose port 80
EXPOSE 80

# Start Nginx
CMD ["nginx", "-g", "daemon off;"]
