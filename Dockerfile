# ---------- Stage 1: Build React Frontend ----------
FROM node:18 AS frontend-build

# Set working directory
WORKDIR /app/frontend

# Copy package.json and install dependencies
COPY ./sales-frontend/package*.json ./
RUN npm install

# Copy rest of the frontend source code
COPY ./sales-frontend/ ./

# Build the production-ready React app
RUN npm run build

# ---------- Stage 2: Setup Python Flask Backend ----------
FROM python:3.10-slim AS backend

# Set working directory
WORKDIR /app

# Copy backend files
COPY ./backend /app/backend

# Copy the built frontend from previous stage
COPY --from=frontend-build /app/frontend/build /app/backend/build

# Install Python dependencies
RUN pip install --no-cache-dir -r /app/backend/requirements.txt

# Set environment variables for Flask
ENV FLASK_APP=backend/app.py
ENV FLASK_RUN_HOST=0.0.0.0
ENV FLASK_ENV=production

# Expose Flask port
EXPOSE 5000

# Start Flask app
CMD ["flask", "run", "--host=0.0.0.0", "--port=5000"]
