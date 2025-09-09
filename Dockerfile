# ========================
# Stage 1: Build the React app with Vite
# ========================
FROM node:24.6.0-alpine3.22 as build

# Set working directory
WORKDIR /app

# Copy package files
COPY package*.json ./

# Install dependencies
RUN npm i --legacy-peer-deps

# Copy source code
COPY . .

# Build the app
RUN npm run build


# ========================
# Stage 2: Serve with Nginx
# ========================
FROM nginx:alpine

# Remove default Nginx config
RUN rm -rf /etc/nginx/conf.d/default.conf

# Copy custom Nginx config
COPY nginx.conf /etc/nginx/conf.d/app.conf

# Copy build output to Nginx public folder
COPY --from=build /app/dist /usr/share/nginx/html

# Expose port 8080
EXPOSE 8080

# Start Nginx
CMD ["nginx", "-g", "daemon off;"]
