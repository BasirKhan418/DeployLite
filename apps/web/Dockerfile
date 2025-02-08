FROM node:22.7.0

# Set the working directory inside the container
WORKDIR /app

# Copy package.json and package-lock.json (if available)
COPY ./package*.json ./

# Install dependencies, bypassing peer dependency conflicts
RUN npm install --legacy-peer-deps

# Copy the rest of the application files
COPY . .

# Optional: Clean npm cache to avoid stale references
RUN npm cache clean --force

# Build the application (if necessary)
RUN npm run build

# Expose the application port
EXPOSE 3000

# Run the application (adjust as necessary)
CMD ["npm", "start"]
