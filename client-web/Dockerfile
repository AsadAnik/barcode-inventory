# Use Node.js LTS version
FROM node:20-alpine

# Set the working directory in the container
WORKDIR /usr/src/app

# Copy package.json and package-lock.json
COPY package*.json ./

# Install dependencies
RUN npm install --legacy-peer-deps

# Copy the rest of the app's code
COPY . .

# Build the Next.js app
RUN npm run build

# Expose the application port (3000 is default for Next.js)
EXPOSE 3000

# Start the app
CMD ["npm", "run", "start"]
