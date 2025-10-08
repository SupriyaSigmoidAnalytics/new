# Step 1: Choose a base image
FROM node:20

# Step 2: Set working directory inside container
WORKDIR /app

# Step 3: Copy package.json and install dependencies
COPY package*.json ./
RUN npm install

# Step 4: Copy the rest of the backend code
COPY . .

# Step 5: Expose port backend listens on
EXPOSE 5000

# Step 6: Command to start backend
CMD ["node", "service.js"]
