# Step 1: Build stage
FROM node:20 AS build

WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build

# Step 2: Serve the build using nginx
FROM nginx:alpine
COPY --from=build /app/build /usr/share/nginx/html

# Expose port 80 for frontend
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]  # Step 1: Build stage
FROM node:20 AS build

WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build

# Step 2: Serve with custom nginx config
FROM nginx:alpine
COPY --from=build /app/build /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
