# Use official Node.js lts image
FROM node:18-alpine

# Set working directory
WORKDIR /app

# Copy package json files
COPY package*.json ./

# Install dependencies
RUN npm install --production

# Copy app source source
COPY . .

# Create directory for uploads if it doesn't exist and set permissions
# This ensures the volume mount point exists and has correct permissions
RUN mkdir -p assets/uploaded && chown -R node:node assets/uploaded

# Expose port (default 3000)
EXPOSE 3000

# Perform permissions switch to non-root user
USER node

# Start command
CMD ["npm", "start"]
