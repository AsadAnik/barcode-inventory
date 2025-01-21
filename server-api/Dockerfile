# Use Node.js LTS Alpine for a lightweight image
FROM node:20-alpine

# Set the working directory in the container
WORKDIR /usr/src/app

# Copy package.json and package-lock.json files to the working directory
COPY package*.json ./

# Install application dependencies
RUN npm install

# Build the application
# RUN npm run build

# Copy the entire project to the container
COPY . .

# Expose the port the app runs on
EXPOSE 8080

# Set the command to start the server
CMD ["npm", "run", "start"]
