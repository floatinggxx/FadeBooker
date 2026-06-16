FROM node:20-alpine

# Create app directory
WORKDIR /usr/src/app

# Install dependencies
COPY package*.json ./
RUN npm ci --only=production

# Copy source
COPY . .

# Expose port (the app listens on env PORT or 3000)
ENV PORT=3000
EXPOSE 3000

# Start
CMD ["npm", "start"]
