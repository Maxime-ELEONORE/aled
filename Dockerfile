# Use an official Node.js runtime as a base image
FROM node:latest

# Create and set the working directory
WORKDIR /usr/src/api

# Copy package.json and package-lock.json to the working directory
COPY package*.json ./

# Install app dependencies
RUN npm install

# Copy the application code into the container
COPY . .

# Expose the port that the app will run on
EXPOSE 4000

# Define the command to run your application
CMD ["node", "index.js"]